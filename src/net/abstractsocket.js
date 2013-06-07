goog.provide('jssip.net.AbstractSocket');

goog.require('jssip.net.Socket');
goog.require('jssip.net.event.SocketEvent');



/**
 * @param {!goog.events.EventTarget} eventTarget
 * @constructor
 * @implements {jssip.net.Socket}
 */
jssip.net.AbstractSocket = function(eventTarget) {
  /** @private {!jssip.net.EventTarget} */
  this.eventTarget_ = eventTarget;
};


/** @override */
jssip.net.AbstractSocket.prototype.receive = function(data, host, port) {
  this.eventTarget_.dispatchEvent(new jssip.net.event.SocketEvent(
      jssip.net.Socket.EventType.RECEIVEMESSAGE, data, host, port));
};


/** @override */
jssip.net.AbstractSocket.prototype.write = goog.abstractMethod;


/** @override */
jssip.net.AbstractSocket.prototype.bind = goog.abstractMethod;


/** @override */
jssip.net.AbstractSocket.prototype.connect = goog.abstractMethod;


/** @override */
jssip.net.AbstractSocket.prototype.close = goog.abstractMethod;
