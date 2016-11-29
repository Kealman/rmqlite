/**
 * @module index
 */
'use strict';

const rmq = require('./lib/RabbitMQ');

module.exports = function (url, opt) {
  return rmq(url, opt);
};
