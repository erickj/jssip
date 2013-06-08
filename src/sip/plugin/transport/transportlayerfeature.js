goog.provide('jssip.sip.plugin.transport.TransportLayerFeature');
goog.provide('jssip.sip.plugin.transport.TransportLayerFeature.Facade');

goog.require('jssip.sip.UserAgent');
goog.require('jssip.sip.protocol.TransportLayer');



/**
 * @param {string} name
 * @param {!jssip.net.SocketFactoryRegistry} socket
 * @constructor
 * @implements {jssip.sip.protocol.TransportLayer}
 */
jssip.sip.plugin.transport.TransportLayerFeature = function(name, socketFactoryRegistry) {
  /** @private {!jssip.net.SocketFactoryRegistry} */
  this.socketFactoryRegistry_ = socketFactoryRegistry;

  /** @private {!jssip.sip.plugin.transport.TransportLayerFeature} */
  this.facade_ = new jssip.sip.plugin.transport.TransportLayerFeature.Facade(this);

  var featureTypes = [
    jssip.sip.UserAgent.CoreFeatureType.TRANSPORTLAYER
  ];
  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
      featureTypes);
}


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.plugin.transport.TransportLayerFeature.prototype.send =
    function(messageContext) {
  var host = this.resolveHostForMessageContext_(messageContext);

};



/**
 * @param {!jssip.sip.plugin.transport.TransportLayerFeature} delegate
 * @constructor
 * @private
 * @implements {jssip.sip.protocol.TransportLayer}
 */
jssip.sip.plugin.transport.TransportLayerFeature.Facade = function(delegate) {
  /** @private {!jssip.sip.plugin.transport.TransportLayerFeature} */
  this.delegate_ = delegate;
};


/** @override */
jssip.sip.plugin.transport.TransportLayerFeature.Facade.prototype.send =
    function(messageContext) {
  this.delegate_.send(messageContext);
};