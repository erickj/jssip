goog.provide('jssip.net.SocketFactoryRegistry');



/**
 * @param {!Object.<jssip.net.Socket.Type, !jssip.net.SocketFactory>}
 *     socketFactoryMap
 * @constructor
 */
jssip.net.SocketFactoryRegistry = function(socketFactoryMap) {
  /** @private {!Object.<jssip.net.Socket.Type, !jssip.net.SocketFactory>} */
  this.socketFactoryMap_ = socketFactoryMap;
};


/**
 * Creates a new socket of the specified type.
 * @param {jssip.net.Socket.Type} type
 * @param {!jssip.event.EventBus} eventBus
 * @return {!jssip.net.Socket}
 * @throws {Error} If the socket type is not registered.
 */
jssip.net.SocketFactoryRegistry.prototype.createSocket =
    function(type, eventBus) {
  if (!this.socketFactoryMap_[type]) {
    throw Error('Unregistered socket type: ' + type);
  }
  return this.socketFactoryMap_[type].createSocket(eventBus);
};
