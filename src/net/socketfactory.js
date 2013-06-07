goog.provide('jssip.net.SocketFactory');



/**
 * @interface
 */
jssip.net.SocketFactory = function() {};


/**
 * @param {!goog.events.EventTarget} eventTarget
 * @return {!jssip.net.Socket}
 */
jssip.net.SocketFactory.prototype.createSocket = goog.abstractMethod;
