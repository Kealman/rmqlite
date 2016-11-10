/**
 * @module RabbitMQ
 */
'use strict';
const _ = require('lodash');
const co = require('co');
const amqplib = require('amqplib');
const EventEmitter = require('events');

const promisify = function (obj) {
  return new Promise(function (res, rej) {
    obj.then(res).then(null, rej);
  });
};

const connecting = function (connect) {
  return promisify(connect).then(function (conn) {
    return promisify(conn.createChannel());
  });
};

class RabbitEvents extends EventEmitter {
}

/**
 * Message
 * @class
 */
class Message {
  constructor(message, channel) {
    this.msg = message;
    this.channel = channel;
  }

  /**
   * Return data as string
   * @returns {String} - message data
   */
  toString() {
    return this.msg.content.toString();
  }

  /**
   * Return data as object
   * (Using JSON.parse)
   * @returns {Object} - message data
   */
  toJSON() {
    return JSON.parse(this.toString());
  }

  /**
   * Ack message
   * @returns {deliveryTag} - Delivery tag
   */
  ack() {
    return this.channel.ack(this.msg);
  }

  // legacy
  get message() {
    return this.toJSON();
  }

}

module.exports = function (url, opt) {
  let connect = amqplib.connect(url, opt);
  let events = new RabbitEvents();
  events.setMaxListeners(0);
  /**
   * @class
   */
  class RabbitMQ {
    /**
     * @constructor
     * @param {string} exchanger - exchanger name
     * @param {string} queue  - queue name
     * @param {object} [queueOptions]  - queue options {@link http://www.squaremobius.net/amqp.node/channel_api.html#channel-assertqueue | see this}
     * @param {boolean} [queueOptions.bind=true] - bind to exchanger by queue name
     * @param {boolean} [queueOptions.assert=true] - assert queue
     * @param {object} [exchangerOptions]  - exchange options {@link http://www.squaremobius.net/amqp.node/channel_api.html#channel-assertexchange | see this}
     */
    constructor(exchanger, queue, queueOptions, exchangerOptions) {
      this.exchanger = exchanger || '';
      this.queue = queue;
      this.queueOptions = queueOptions || {};
      this.exchangerOptions = exchangerOptions || {};
      this.connect = connect;
      this._subscribeCache = null;
      this.channel = connecting(connect);
      this.assertion = this.assert();
      this.ct = null;
      this.binds = [];
      events.on('reconnect', this.restart.bind(this));
    }

    assert() {
      return co(function *() {
        let ch = yield this.channel;
        if (this.queueOptions.assert !== false) {
          yield promisify(ch.assertQueue(this.queue, this.queueOptions));
        }
        if (this.exchanger !== '') {
          yield promisify(ch.assertExchange(this.exchanger, this.exchangerOptions.type || 'fanout', this.exchangerOptions));
          if (this.queueOptions.assert !== false && this.queueOptions.bind !== false) {
            yield promisify(ch.bindQueue(this.queue, this.exchanger, this.queue));
          }
        }
      }.bind(this));
    }

    /**
     * @callback MessageHandler
     * @param {Message} message  - incoming message
     */

    /**
     * Subscribe to queue
     * @param {MessageHandler} callback  - message handler
     * @param {boolean} [ack=false]  - Acknowledge the given message
     * @param {object} [options]  - {@link http://www.squaremobius.net/amqp.node/channel_api.html#channel_consume | See this}
     * @returns {Promise}
     */
    subscribe(callback, ack, options, rc) {
      return co(function *() {
        let ct = yield this._subscribe(callback, ack, options, rc);
        if(ct) {
          this.ct = ct.consumerTag;
        }
      }.bind(this));
    }

    /**
     * Unsubscribe from queue
     * @returns {Promise}
     */
    unsubscribe() {
      return co(function *() {
        if (!this.ct) {
          return;
        }

        let ch = yield this.channel;
        ch.cancel(this.ct);
        this.ct = null;
        this._subscribeCache = null;
      }.bind(this));
    }
    
    /**
     * Delete queue
     * @returns {Promise}
     */
    delete() {
      return co(function *(){
        let ch = yield this.channel;
        return yield promisify(ch.deleteQueue(this.queue));
      }.bind(this));
    }

    /**
     * Publish message
     * @param {*} message - message for publish
     * @param {string} [routingKey] - publish with routingKey
     * @param {Object} [options] - publish options 
     * @returns {Promise}
     */
    publish(message, routingKey, options) {
      return co(function *() {
        let ch = yield this.channel;
        yield this.assertion;

        return ch.publish(this.exchanger, routingKey || this.queue, new Buffer(JSON.stringify(message)), options);
      }.bind(this));
    }

    /**
     * Bind queue to exchanger with routing key
     * @param {string|Array} routingKeys - Routing keys
     * @returns {*}
     */
    bind(routingKeys) {
      return this._bindProccess('bindQueue', routingKeys);
    }

    /**
     * Unbind queue to exchanger with routing key
     * @param {string|Array} routingKeys - Routing keys
     * @returns {*}
     */
    unbind(routingKeys) {
      return this._bindProccess('unbindQueue', routingKeys);
    }

    _bindProccess(method, routingKeys) {
      if (routingKeys && !_.isArray(routingKeys)) {
        routingKeys = [routingKeys];
      }

      let bind = method === 'bindQueue';
      if (this.exchanger === '') {
        throw new Error(`No ${bind ? 'bind to' : 'unbind from'} default exchanger`);
      }

      return co(function *() {
        let ch = yield this.channel;
        yield this.assertion;
        for (let route of routingKeys) {
          yield promisify(ch[method](this.queue, this.exchanger, route));
          if (bind) {
            this.binds.push(route);
          } else {
            this.binds.splice(this.binds.indexOf(route), 1);
          }
        }
      }.bind(this));
    }

    restart(conn) {
      return co(function *() {
        this.channel = connecting(conn);
        this.assertion = this.assert();
        if (this._subscribeCache) {
          yield this.subscribe(this._subscribeCache.cb, this._subscribeCache.ack, this._subscribeCache.opt, true);
        }

        if (this.binds.length) {
          yield this.bind(this.binds);
        }
      }.bind(this));
    }

    *_subscribe(callback, ack, options, rc) {
      let ch = yield this.channel;

      if (this._subscribeCache && !rc) {
        return this.ct;
      }

      this._subscribeCache = {
        cb: callback,
        ack: ack,
        opt: options
      };

      yield this.assertion;
      if(!_.isUndefined(options.prefetch)) {
        yield promisify(ch.prefetch(options.prefetch));
      }
      return yield promisify(ch.consume(this.queue, (mes)=>callback(new Message(mes, ch)), _.extend({
        noAck: !ack
      }, options || {})));
    }

    /**
     * Remove this object from EventEmmiter
     * WARNING: This function must be called if you not used this object.
     */
    destroy() {
      events.removeListener('reconnect', this.restart);
    }
  }

  let listeners = [];
  /**
   * @static
   * @param {string} event - event {@link http://www.squaremobius.net/amqp.node/channel_api.html#model_events | See this} and 'connect' event
   * @param {function} cb - callback function
   */
  RabbitMQ.on = function (event, cb, re) {
    if (!re) {
      listeners.push({event: event, cb: cb});
    }
    connect.then(function (con) {
      if (event === 'connect') {
        cb();
      } else {
        con.on(event, cb);
      }
    }).then(null, function (err) {
      if (event === 'error') {
        cb(err);
      }

      if (event === 'close') {
        cb();
      }
    });
  };

  /**
   * Reconnect to RabbitMQ server and resubscribe and bind all queue
   * @static
   */
  RabbitMQ.reconnect = function () {
    connect = amqplib.connect(url, opt);
    if (listeners.length) {
      for (let listener of listeners) {
        RabbitMQ.on(listener.event, listener.cb, true);
      }
    }

    events.emit('reconnect', connect);
  };

  return RabbitMQ;
};

