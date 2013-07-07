goog.provide('jssip.sip.plugin.core.UserAgentFeature');
goog.provide('jssip.sip.plugin.core.UserAgentFeature.Facade_');

goog.require('goog.asserts');
goog.require('goog.crypt');
goog.require('goog.crypt.Sha256');
goog.require('goog.object');
goog.require('jssip.message.BuilderMessageContext');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');
goog.require('jssip.sip.UserAgent');
goog.require('jssip.sip.event.MessageEvent');
goog.require('jssip.sip.plugin.core.MessageDestinationFetcher');
goog.require('jssip.sip.plugin.core.HeaderParserFactoryImpl');
goog.require('jssip.sip.plugin.core.SipUriParserFactory');
goog.require('jssip.sip.protocol.feature.UserAgentClient');
goog.require('jssip.sip.protocol.feature.UserAgentServer');
goog.require('jssip.sip.protocol.header.NameAddrHeaderParserFactory');
goog.require('jssip.sip.protocol.header.NameAddrListHeaderParserFactory');
goog.require('jssip.sip.protocol.header.ViaHeaderParserFactory');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.uri.Uri');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.plugin.core.UserAgentFeature = function(name) {
  /** @private {!jssip.sip.plugin.core.UserAgentFeature.Facade_} */
  this.facade_ = new jssip.sip.plugin.core.UserAgentFeature.Facade_(this);

  /** @private {jssip.sip.plugin.core.HeaderParserFactoryImpl} */
  this.headerParserFactory_ = null;

  /** @private {jssip.sip.plugin.core.MessageDestinationFetcher} */
  this.messageDestinationFetcher_ = null;

  /**
   * @private {!Object}
   * @suppress {missingRequire}
   */
  this.headerParserSet_ = goog.object.transpose(
      jssip.sip.protocol.rfc3261.HeaderType);

  /** @private {!Object} */
  this.uriParserSet_ = {};
  this.uriParserSet_[jssip.uri.Uri.Scheme.SIP] = true;
  this.uriParserSet_[jssip.uri.Uri.Scheme.SIPS] = true;

  var featureTypes = [
    jssip.sip.protocol.feature.UserAgentClient.TYPE,
    jssip.sip.protocol.feature.UserAgentServer.TYPE
  ];

  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
      featureTypes, goog.object.getKeys(this.headerParserSet_),
      goog.object.getKeys(this.uriParserSet_));
};
goog.inherits(
    jssip.sip.plugin.core.UserAgentFeature, jssip.plugin.AbstractFeature);


/** @override */
jssip.sip.plugin.core.UserAgentFeature.prototype.onActivated = function() {
  this.messageDestinationFetcher_ =
      new jssip.sip.plugin.core.MessageDestinationFetcher(
          this.getFeatureContext().getPlatformContext().getResolver());
};

/** @override */
jssip.sip.plugin.core.UserAgentFeature.prototype.getHeaderParserFactory =
    function(name) {
  var eventBus = this.getFeatureContext().getEventBus();
  if (!this.headerParserSet_[name]) {
    throw Error('Unsupported header: ' + name);
  }
  if (!this.headerParserFactory_) {
    this.headerParserFactory_ =
        new jssip.sip.plugin.core.HeaderParserFactoryImpl(eventBus);
  }

  var rfc3261 = jssip.sip.protocol.rfc3261;
  var headerParserFactory = this.headerParserFactory_;
  switch (name) {
    case rfc3261.HeaderType.CONTACT:
    case rfc3261.HeaderType.ROUTE:
    case rfc3261.HeaderType.RECORD_ROUTE:
      return new jssip.sip.protocol.header.NameAddrListHeaderParserFactory(
          headerParserFactory, name,
          this.getFeatureContext().getParserRegistry());
    case rfc3261.HeaderType.FROM:
    case rfc3261.HeaderType.TO:
      return new jssip.sip.protocol.header.NameAddrHeaderParserFactory(
          headerParserFactory, name,
          this.getFeatureContext().getParserRegistry());
    case rfc3261.HeaderType.VIA:
      return new jssip.sip.protocol.header.ViaHeaderParserFactory(
          headerParserFactory, name);
    default:
      return headerParserFactory;
  }
};


/** @override */
jssip.sip.plugin.core.UserAgentFeature.prototype.getUriParserFactory =
    function(scheme) {
  var eventBus = this.getFeatureContext().getEventBus();
  if (!this.uriParserSet_[scheme]) {
    throw Error('Unsupported URI scheme: ' + scheme);
  }
  return new jssip.sip.plugin.core.SipUriParserFactory(eventBus);
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 * @param {string} type
 * @private
 * @return {!jssip.sip.event.MessageEvent}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.createEvent_ =
    function(messageContext, type) {
  return new jssip.sip.event.MessageEvent(messageContext, type);
};


/**
 * Fires CREATE_RESPONSE event.  This builder sets headers so that they do NOT
 * overwrite existing headers.
 *
 * @see {jssip.sip.protocol.feature.UserAgentClient#createRequest}
 * @param {!jssip.message.Message.Builder} messageBuilder A message builder.
 * @param {string} method The SIP request method.
 * @param {!jssip.uri.Uri} toUri A to URI.
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.createRequest =
    function(messageBuilder, method, toUri) {
  var rfc3261 = jssip.sip.protocol.rfc3261;
  var builderMessageContext = new jssip.message.BuilderMessageContext(
      messageBuilder, this.getFeatureContext().getParserRegistry(),
      this.getSipContext());
  var headerMap = {};

  messageBuilder.setSipVersion(rfc3261.SIP_VERSION);
  messageBuilder.setMethod(method);

  messageBuilder.setRequestUri(toUri.stringify());
  headerMap[rfc3261.HeaderType.TO] = this.generateToFromHeader_(toUri);
  headerMap[rfc3261.HeaderType.FROM] =
      this.generateFromHeader_(this.generateTag_());
  headerMap[rfc3261.HeaderType.CALL_ID] = this.generateCallId_();
  headerMap[rfc3261.HeaderType.CSEQ] = this.generateCSeq_(method);
  headerMap[rfc3261.HeaderType.MAX_FORWARDS] = this.generateMaxForwards_();
  headerMap[rfc3261.HeaderType.CONTACT] = this.generateContact_();

  // Set headers so that they do NOT overwrite existing headers.
  for (var headerName in headerMap) {
    messageBuilder.setHeader(
        headerName, headerMap[headerName], false /* opt_overwrite */);
  }

  this.dispatchEvent(this.createEvent_(builderMessageContext,
      jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST));
  return builderMessageContext;
};


/**
 * Sends the request.
 *
 * @see {jssip.sip.protocol.feature.UserAgentClient#sendRequest}
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @return {!jssip.async.Promise.<boolean>}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.sendRequest =
    function(requestMessageContext) {
  goog.asserts.assert(requestMessageContext.isRequest());
  this.generateInDialogRequest_(requestMessageContext);
};


/**
 * Generating the Request in a Dialog
 * @see {http://tools.ietf.org/html/rfc3261#section-12.2.1.1}
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateInDialogRequest_ =
    function(requestMessageContext) {
  var dialog = requestMessageContext.getDialog();
  if (!dialog) {
    return;
  }
  var rfc3261 = jssip.sip.protocol.rfc3261;
  var toHeader =
      this.generateToFromHeader_(dialog.getRemoteUri(), dialog.getRemoteTag());
  requestMessageContext.setHeader(rfc3261.HeaderType.TO, toHeader);
  var fromHeader =
      this.generateToFromHeader_(dialog.getLocalUri(), dialog.getLocalTag());
  requestMessageContext.setHeader(rfc3261.HeaderType.FROM, fromHeader);
};



/**
 * @param {!jssip.uri.Uri} uri
 * @param {string=} opt_tag
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateToFromHeader_ =
    function(uri, opt_tag) {
  // TODO(erick): Set the To header according to 3261#20.39 e.g. allow for
  // display-names in the To and figure out something to do with dialog tags.
  var headerValue = uri.stringify();
  if (opt_tag) {
    headerValue += ';tag=' + opt_tag;
  }
  return headerValue;
};


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.3}
 * @see {http://tools.ietf.org/html/rfc3261#section-20.20}
 * @param {!jssip.uri.Uri} fromUri
 * @param {string=} opt_tag The from tag
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateFromHeader_ =
    function(opt_tag) {
  var aor = this.getFeatureContext().getUserAgentConfigProperty(
      jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD);
  var displayName = this.getFeatureContext().getUserAgentConfigProperty(
      jssip.sip.UserAgent.ConfigProperty.DISPLAY_NAME) ||
      jssip.sip.protocol.rfc3261.DEFAULT_DISPLAY_NAME;
  // TODO(erick): Need to build this so it has a scheme.
  var headerValue = displayName + ' <sip:' + aor + '>';
  if (opt_tag) {
    headerValue += ';tag=' + opt_tag;
  }
  return headerValue;
};


/**
 * Generate a tag for From and To headers
 * @see {http://tools.ietf.org/html/rfc3261#section-19.3}
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateTag_ = function() {
  var randomStr = this.generateHexDigest_();
  // I am arbitrarily choosing length 7!  As long as it's more than 32 bits of
  // randomness, then I don't see a problem
  return randomStr.substring(0, 7);
};


// TODO(erick): Make Call-ID generation more robust, currently this is just a
// Sha256 of a random number.
/**
 * Generates a call id.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.4}
 * @return {string} A call id.
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateCallId_ = function() {
  return this.generateHexDigest_().substring(0, 31);
};


/**
 * Generates a CSeq.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @param {string} method
 * @return {string} A CSeq.
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateCSeq_ =
    function(method) {
  // TODO(erick): I don't see any reason right now to choose anything other than
  // 1.  Find out if this is the case.
  return '1 ' + method;
};


/**
 * Get the standard Max-Forwards value.  The RFC states it SHOULD be 70.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.6}
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateMaxForwards_ =
    function() {
  return jssip.sip.protocol.rfc3261.MAX_FORWARDS;
};


/**
 * Gets a Via header.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.7}
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateVia_ = function() {
  // TODO(erick): This should be overwritten by the transport plugin w/ the the
  // correct transport protocol.
  var viaSentBy = this.getFeatureContext().getUserAgentConfigProperty(
      jssip.sip.UserAgent.ConfigProperty.VIA_SENT_BY);
  var branchId = jssip.sip.protocol.rfc3261.BRANCH_ID_PREFIX + '-' +
      this.generateHexDigest_();
  return 'SIP/2.0/UDP ' + viaSentBy + ';branch=' + this.generateBranchId_();
};


/**
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateBranchId_ =
    function() {
  return jssip.sip.protocol.rfc3261.BRANCH_ID_PREFIX + '-' +
      this.generateHexDigest_().substring(0, 15);
};


/**
 * Generates a Contact header.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.8}
 * @see {http://tools.ietf.org/html/rfc3261#section-20.10}
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateContact_ = function() {
  return '<' + this.getFeatureContext().getUserAgentConfigProperty(
      jssip.sip.UserAgent.ConfigProperty.CONTACT) + '>';
};


/**
 * Generate a Sha256 hex digest. If no seed is provided, then a random seed will
 * be generated.
 * @param {string=} opt_seed A seed for the digest.
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateHexDigest_ =
    function(opt_seed) {
  var seed = opt_seed || '' + Math.random();
  var sha256 = new goog.crypt.Sha256();
  sha256.update(goog.crypt.stringToByteArray(seed));
  return goog.crypt.byteArrayToHex(sha256.digest());
};


/**
 * Receives a response off the wire and dispatches a UAC RECEIVE_RESPONSE event.
 * @param {!jssip.message.MessageContext} messageContext
 * @throws {Error} If the message context is not a response.
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.handleResponse =
    function(messageContext) {
  if (messageContext.getMessage().isRequest()) {
    throw Error('Message is not a response');
  }

  var event = this.createEvent_(messageContext,
      jssip.sip.protocol.feature.UserAgentClient.EventType.RECEIVE_RESPONSE);
  this.dispatchEvent(event);
};


/**
 * Receives a request off the wire and dispatches a UAS RECEIVE_REQUEST event.
 * @param {!jssip.message.MessageContext} messageContext
 * @throws {Error} If the message context is not a request.
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.handleRequest =
    function(messageContext) {
  if (!messageContext.getMessage().isRequest()) {
    throw Error('Message is not a request');
  }

  var event = this.createEvent_(
      messageContext,
      jssip.sip.protocol.feature.UserAgentServer.EventType.RECEIVE_REQUEST);
  this.dispatchEvent(event);
};



/**
 * @param {!jssip.sip.plugin.core.UserAgentFeature} delegate The core feature
 *     instance to delegate to.
 * @constructor
 * @private
 * @implements {jssip.sip.protocol.feature.UserAgentClient}
 * @implements {jssip.sip.protocol.feature.UserAgentServer}
 * @implements {jssip.plugin.FeatureFacade}
 */
jssip.sip.plugin.core.UserAgentFeature.Facade_ = function(delegate) {
  /** @private {!jssip.sip.plugin.core.UserAgentFeature} */
  this.delegate_ = delegate;
};


/** @override */
jssip.sip.plugin.core.UserAgentFeature.Facade_.prototype.createRequest =
    function(messageBuilder, method, toUri) {
  return this.delegate_.createRequest(messageBuilder, method, toUri);
};


/** @override */
jssip.sip.plugin.core.UserAgentFeature.Facade_.prototype.sendRequest =
    function(requestMessageContext) {
  return this.delegate_.sendRequest(requestMessageContext);
};


/** @override */
jssip.sip.plugin.core.UserAgentFeature.Facade_.prototype.handleResponse =
    function(responseMessageContext) {
  this.delegate_.handleResponse(responseMessageContext);
};


/** @override */
jssip.sip.plugin.core.UserAgentFeature.Facade_.prototype.handleRequest =
    function(requestMessageContext) {
  this.delegate_.handleRequest(requestMessageContext);
};
