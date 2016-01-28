/**
 * @module index
 */
'use strict';

const amqplib = require('amqplib');
const rmq = require('./lib/RabbitMQ');

module.exports = function (url, opt) {
  return rmq(url, opt);
};