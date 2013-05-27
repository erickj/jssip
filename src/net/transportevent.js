goog.provide('jssip.net.TransportEvent');



/**
 * @param {string} message The message from the network layer.
 * @constructor
 */
jssip.net.TransportEvent = function(message) {
  /** @type {string} */
  this.message = message;
};
