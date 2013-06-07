goog.provide('jssip.net.event.SocketEvent');

goog.require('goog.events.Event');



/**
 * A socket event
 * @param {string} type
 * @param {string} data
 * @param {string} host
 * @param {number} port
 * @constructor
 * @extends {goog.events.Event}
 */
jssip.net.event.SocketEvent = function(type, data, host, port) {
  goog.base(this, type);

  /** @type {string} */
  this.data = data;

  /** @type {string} */
  this.host = host;

  /** @type {number} */
  this.port = port;
};
