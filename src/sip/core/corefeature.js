goog.provide('jssip.sip.core.CoreFeature');
goog.provide('jssip.sip.core.CoreFeature.Facade');

goog.require('jssip.core.feature.MessageEvent');
goog.require('jssip.core.feature.UserAgentClient');
goog.require('jssip.core.feature.UserAgentServer');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.core.CoreFeature = function(name) {
  /** @private {!jssip.sip.core.CoreFeature.Facade} */
  this.facade_ = new jssip.sip.core.CoreFeature.Facade(this);

  var featureTypes = [
    jssip.core.feature.UserAgentClient.FEATURE_TYPE,
    jssip.core.feature.UserAgentServer.FEATURE_TYPE
  ];
  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
      featureTypes);
};
goog.inherits(jssip.sip.core.CoreFeature, jssip.plugin.AbstractFeature);


/**
 * @param {!jssip.message.MessageContext} messageContext
 * @param {jssip.core.feature.UserAgentClient.EventType|
 *     jssip.core.feature.UserAgentServer.EventType} type
 * @private
 * @return {!jssip.core.feature.MessageEvent}
 */
jssip.sip.core.CoreFeature.prototype.createEvent_ =
    function(messageContext, type) {
  return new jssip.core.feature.MessageEvent(messageContext, type);
};


/**
 * @param {string|!jssip.uri.Uri} uri A URI.
 * @param {string} method A request method.
 */
jssip.sip.core.CoreFeature.prototype.createRequest = function(uri, method) {
  // TODO(erick)
};


/**
 * Sends a request message.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.CoreFeature.prototype.sendRequest = function(messageContext) {
  // TODO(erick)
};


/**
 * Receives a response off the wire and dispatches a UAC RECEIVE_MESSAGE event.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.CoreFeature.prototype.handleResponse = function(messageContext) {
  var event = this.createEvent_(
      messageContext,
      jssip.core.feature.UserAgentClient.EventType.RECEIVE_MESSAGE);
  this.dispatchEvent(event);
};


/**
 * Receives a request off the wire and dispatches a UAS RECEIVE_MESSAGE event.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.CoreFeature.prototype.handleRequest = function(messageContext) {
  var event = this.createEvent_(
      messageContext,
      jssip.core.feature.UserAgentServer.EventType.RECEIVE_MESSAGE);
  this.dispatchEvent(event);
};



/**
 * @param {!jssip.sip.core.CoreFeature} delegate The core feature instance to
 *     delegate to.
 * @constructor
 * @implements {jssip.core.feature.UserAgentClient}
 * @implements {jssip.core.feature.UserAgentServer}
 * @implements {jssip.plugin.FeatureFacade}
 */
jssip.sip.core.CoreFeature.Facade = function(delegate) {
  /** @private {!jssip.core.feature.CoreFeature} */
  this.delegate_ = delegate;
};


/** @override */
jssip.sip.core.CoreFeature.Facade.prototype.createRequest =
    function(uri, method) {
  this.delegate_.createRequest(uri, method);
};


/** @override */
jssip.sip.core.CoreFeature.Facade.prototype.sendRequest =
    function(messageContext) {
  this.delegate_.sendRequest(messageContext);
};


/** @override */
jssip.sip.core.CoreFeature.Facade.prototype.handleResponse =
    function(messageContext) {
  this.delegate_.handleResponse(messageContext);
};


/** @override */
jssip.sip.core.CoreFeature.Facade.prototype.handleRequest =
    function(messageContext) {
  this.delegate_.handleRequest(messageContext);
};
