goog.provide('jssip.sip.core.UserAgentFeature');
goog.provide('jssip.sip.core.UserAgentFeature.Facade');

goog.require('goog.crypt');
goog.require('goog.crypt.Sha256');
goog.require('jssip.core.UserAgent');
goog.require('jssip.core.feature.MessageEvent');
goog.require('jssip.core.feature.UserAgentClient');
goog.require('jssip.core.feature.UserAgentServer');
goog.require('jssip.core.feature.rfc3261');
goog.require('jssip.message.BuilderMessageContext');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');
goog.require('jssip.uri.Uri');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.core.UserAgentFeature = function(name) {
  /** @private {!jssip.sip.core.UserAgentFeature.Facade} */
  this.facade_ = new jssip.sip.core.UserAgentFeature.Facade(this);

  var featureTypes = [
    jssip.core.UserAgent.CoreFeatureType.USERAGENTCLIENT,
    jssip.core.UserAgent.CoreFeatureType.USERAGENTSERVER
  ];
  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
      featureTypes);
};
goog.inherits(jssip.sip.core.UserAgentFeature, jssip.plugin.AbstractFeature);


/**
 * @param {!jssip.message.MessageContext} messageContext
 * @param {string} type
 * @private
 * @return {!jssip.core.feature.MessageEvent}
 */
jssip.sip.core.UserAgentFeature.prototype.createEvent_ =
    function(messageContext, type) {
  return new jssip.core.feature.MessageEvent(messageContext, type);
};


/**
 * @see {jssip.core.feature.UserAgentClient#createRequest}
 * @param {string} method A request method.
 * @param {!jssip.uri.Uri} requestUri A URI.
 * @param {!jssip.uri.Uri=} opt_toUri A URI to use for TO header, if
 *     none is provided the {@code requestUri} will be used.
 */
jssip.sip.core.UserAgentFeature.prototype.createRequest =
    function(method, requestUri, opt_toUri) {
  var rfc3261 = jssip.core.feature.rfc3261;
  var messageBuilder = new jssip.message.Message.Builder();
  var messageContext = new jssip.message.BuilderMessageContext(
      messageBuilder, this.getFeatureContext().getParserRegistry());
  var headerMap = {};

  messageBuilder.setSipVersion(rfc3261.SIP_VERSION);
  messageBuilder.setMethod(method);

  // TODO(erick): Set the request URI according to 3261#12.2.1.1
  // TODO(erick): Validate the URI, parsing a string is probably reasonable.
  messageBuilder.setRequestUri(requestUri.toString());

  headerMap[rfc3261.HeaderType.TO] = this.getToUri_(opt_toUri || requestUri);
  headerMap[rfc3261.HeaderType.FROM] = this.getFeatureContext().
      getUserAgentConfigProperty(
          jssip.core.UserAgent.ConfigProperty.ADDRESS_OF_RECORD);
  headerMap[rfc3261.HeaderType.CALL_ID] = this.generateCallId_();
  headerMap[rfc3261.HeaderType.CSEQ] = this.generateCSeq_(method);
  headerMap[rfc3261.HeaderType.MAX_FORWARDS] = this.generateMaxForwards_();

  for (var headerName in headerMap) {
    messageBuilder.setHeader(headerName, headerMap[headerName]);
  }

  this.dispatchEvent(this.createEvent_(messageContext,
      jssip.core.feature.UserAgentClient.EventType.CREATE_MESSAGE));
};


/**
 * @param {!jssip.uri.Uri} toUri
 * @return {string}
 * @private
 */
jssip.sip.core.UserAgentFeature.prototype.getToUri_ = function(toUri) {
  // TODO(erick): Set the To header according to 3261#20.39 e.g. allow for
  // display-names in the To and figure out something to do with dialog tags.
  return toUri.toString();
};

// TODO(erick): Make Call-ID generation more robust, currently this is just a
// Sha256 of a random number.
/**
 * Generates a call id.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.4}
 * @return {string} A call id.
 * @private
 */
jssip.sip.core.UserAgentFeature.prototype.generateCallId_ = function() {
  var seed = '' + Math.random();
  var sha256 = new goog.crypt.Sha256();
  sha256.update(goog.crypt.stringToByteArray(seed));
  return goog.crypt.byteArrayToHex(sha256.digest());
};


/**
 * Generates a CSeq.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @param {string} method
 * @return {string} A CSeq.
 * @private
 */
jssip.sip.core.UserAgentFeature.prototype.generateCSeq_ = function(method) {
  // TODO(erick): I don't see any reason right now to choose anything other than
  // 1.  Find out if this is the case.
  return '1 ' + method;
};


/**
 * Get the standard Max-Forwards value.  The RFC states it SHOULD be 70.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @return {string}
 * @private
 */
jssip.sip.core.UserAgentFeature.prototype.generateMaxForwards_ = function() {
  return jssip.core.feature.rfc3261.MAX_FORWARDS;
};


/**
 * Sends a request message.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.UserAgentFeature.prototype.sendRequest = function(messageContext) {
  // TODO(erick)
};


/**
 * Receives a response off the wire and dispatches a UAC RECEIVE_MESSAGE event.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.UserAgentFeature.prototype.handleResponse = function(messageContext) {
  var event = this.createEvent_(
      messageContext,
      jssip.core.feature.UserAgentClient.EventType.RECEIVE_MESSAGE);
  this.dispatchEvent(event);
};


/**
 * Receives a request off the wire and dispatches a UAS RECEIVE_MESSAGE event.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.core.UserAgentFeature.prototype.handleRequest = function(messageContext) {
  var event = this.createEvent_(
      messageContext,
      jssip.core.feature.UserAgentServer.EventType.RECEIVE_MESSAGE);
  this.dispatchEvent(event);
};



/**
 * @param {!jssip.sip.core.UserAgentFeature} delegate The core feature instance to
 *     delegate to.
 * @constructor
 * @implements {jssip.core.feature.UserAgentClient}
 * @implements {jssip.core.feature.UserAgentServer}
 * @implements {jssip.plugin.FeatureFacade}
 */
jssip.sip.core.UserAgentFeature.Facade = function(delegate) {
  /** @private {!jssip.core.feature.UserAgentFeature} */
  this.delegate_ = delegate;
};


/** @override */
jssip.sip.core.UserAgentFeature.Facade.prototype.createRequest =
    function(method, requestUri, opt_toUri) {
  this.delegate_.createRequest(method, requestUri, opt_toUri);
};


/** @override */
jssip.sip.core.UserAgentFeature.Facade.prototype.sendRequest =
    function(messageContext) {
  this.delegate_.sendRequest(messageContext);
};


/** @override */
jssip.sip.core.UserAgentFeature.Facade.prototype.handleResponse =
    function(messageContext) {
  this.delegate_.handleResponse(messageContext);
};


/** @override */
jssip.sip.core.UserAgentFeature.Facade.prototype.handleRequest =
    function(messageContext) {
  this.delegate_.handleRequest(messageContext);
};
