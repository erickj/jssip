goog.provide('jssip.sip.plugin.transport.TransportLayerFeature');
goog.provide('jssip.sip.plugin.transport.TransportLayerFeature.Facade_');

goog.require('goog.async.Deferred');
goog.require('goog.net.IpAddress');
goog.require('jssip.async.Promise');
goog.require('jssip.net.Socket');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');
goog.require('jssip.sip.plugin.transport.pluginfeature');
goog.require('jssip.sip.protocol.MessageDestination');
goog.require('jssip.sip.protocol.feature.TransportLayer');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.uri.Uri');




/**
 * @param {string} name
 * @param {!jssip.net.SocketFactoryRegistry} socketFactoryRegistry
 * @param {!jssip.net.Resolver} resolver
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.plugin.transport.TransportLayerFeature =
    function(name, socketFactoryRegistry, resolver) {
  /** @private {!jssip.net.SocketFactoryRegistry} */
  this.socketFactoryRegistry_ = socketFactoryRegistry;

  /** @private {!jssip.net.Resolver} */
  this.resolver_ = resolver;

  /** @private {!jssip.sip.plugin.transport.TransportLayerFeature.Facade_} */
  this.facade_ =
      new jssip.sip.plugin.transport.TransportLayerFeature.Facade_(this);

  /** @private {!jssip.event.EventBus} */
  this.socketEventBus_ = new jssip.event.EventBus();

  var featureTypes = [
    jssip.sip.protocol.feature.TransportLayer.TYPE
  ];
  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
      featureTypes);
};
goog.inherits(
    jssip.sip.plugin.transport.TransportLayerFeature, jssip.plugin.AbstractFeature);


/** @enum {number} */
jssip.sip.plugin.transport.TransportLayerFeature.DefaultPort = {
  UDP: 5060,
  TCP: 5060,
  SECURE_UDP: 5061,
  SECURE_TCP: 5061
};


/**
 * Sends a SIP message and returns a promise with a boolen indicating the
 * message was sent successfully (not that a response was received).
 * @param {!jssip.message.BuilderMessageContext} messageContext
 * @return {!jssip.async.Promise.<boolean>}
 */
jssip.sip.plugin.transport.TransportLayerFeature.prototype.send =
    function(messageContext) {
  var destinationUri = this.getUriDestinationForMessage_(messageContext);
  var promiseWithMessageDestinations =
      /** @type {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.MessageDestination>>} */ (
          this.locateSipServerForUri_(destinationUri));
  return promiseWithMessageDestinations.thenBranch(
      goog.bind(this.handleMessageDestinations_, this, messageContext));
};


/**
 * Gets the currently registered ServerLocate feature and calls
 * {@code locateSipServerForUri}.
 * @param {!jssip.uri.Uri} uri
 * @return {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.MessageDestination>>}
 * @private
 */
jssip.sip.plugin.transport.TransportLayerFeature.prototype.
    locateSipServerForUri_ = function(uri) {
  var feature = this.getFeatureContext().getFacadeByType(
      jssip.sip.plugin.transport.pluginfeature.Type.SERVER_LOCATE);

  return /** @type {!jssip.sip.plugin.transport.pluginfeature.ServerLocate} */ (
      feature).locateSipServerForUri(uri);
};


/**
 * @param {!jssip.message.BuilderMessageContext} messageContext
 * @param {!Array.<!jssip.sip.protocol.MessageDestination>} lookupResults
 * @return {boolean}
 * @private
 */
jssip.sip.plugin.transport.TransportLayerFeature.prototype.
    handleMessageDestinations_ = function(messageContext, lookupResults) {
  var lookupResult = lookupResults.shift();
  if (lookupResult) {
    var socket = this.socketFactoryRegistry_.createSocket(
        lookupResult.getSocketType());
    socket.connect(
      lookupResult.getIpAddress().toString(), lookupResult.getPort());
  }
};


/**
 * The functionality defined here is part of UAC behavoir in 3261, but it fits
 * better architecturally here.  Collects a set of destinations to try to send
 * the message to.
 *
 * @see RFC 3261 Section 8.1.2

   If the first element in the route set indicated a strict router (resulting in
   forming the request as described in Section 12.2.1.1), the procedures MUST be
   applied to the Request-URI of the request.  Otherwise, the procedures are
   applied to the first Route header field value in the request (if one exists),
   or to the request's Request-URI if there is no Route header field present.

 * @param {!jssip.message.BuilderMessageContext} messageContext
 * @return {!jssip.uri.Uri}
 */
jssip.sip.plugin.transport.TransportLayerFeature.prototype.
    getUriDestinationForMessage_ = function(messageContext) {
  var routeSet = messageContext.getRouteSet();
  if (!routeSet.isEmpty() && !routeSet.get(0).isLooseRouter()) {
    return messageContext.getMessage().getRequestUri();
  }
  var routes = jssip.sip.protocol.Routes.createFromHeader(
      messageContext.getHeader(jssip.sip.protocol.rfc3261.HeaderType.ROUTE));
  if (routes.length > 0) {
    return routes[0].getUri();
  }
  return messageContext.getMessage().getRequestUri();
};



/**
 * @param {!jssip.sip.plugin.transport.TransportLayerFeature} delegate
 * @constructor
 * @private
 * @implements {jssip.plugin.FeatureFacade}
 * @implements {jssip.sip.protocol.feature.TransportLayer}
 */
jssip.sip.plugin.transport.TransportLayerFeature.Facade_ = function(delegate) {
  /** @private {!jssip.sip.plugin.transport.TransportLayerFeature} */
  this.delegate_ = delegate;
};


/** @override */
jssip.sip.plugin.transport.TransportLayerFeature.Facade_.prototype.send =
    function(messageContext) {
  return this.delegate_.send(messageContext);
};
