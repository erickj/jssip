goog.provide('jssip.sip.plugin.core.UserAgentFeature');
goog.provide('jssip.sip.plugin.core.UserAgentFeature.Facade_');

goog.require('goog.asserts');
goog.require('goog.crypt');
goog.require('goog.crypt.Sha256');
goog.require('goog.object');
goog.require('jssip.async.Promise');
goog.require('jssip.message.BuilderMessageContext');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');
goog.require('jssip.sip.UserAgent');
goog.require('jssip.sip.event.MessageEvent');
goog.require('jssip.sip.plugin.core.MessageDestinationFetcher');
goog.require('jssip.sip.plugin.core.HeaderParserFactoryImpl');
goog.require('jssip.sip.plugin.core.SipUriParserFactory');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.Route');
goog.require('jssip.sip.protocol.feature.TransportLayer');
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

  /** @private {jssip.sip.protocol.feature.TransportLayer} */
  this.transportLayer_ = null;

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
          this.getPlatformContext().getResolver(),
          this.getSipContext(),
          this.getFeatureContext().getParserRegistry());

  this.transportLayer_ =
    /** @type {!jssip.sip.protocol.feature.TransportLayer} */ (
        this.getFeatureContext().getFacadeByType(
            jssip.sip.protocol.feature.TransportLayer.TYPE));
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
 * Creates a request with the given method. After creation fires a
 * CREATE_REQUEST event.  If a dialog is provided then the request is created
 * following in dialog request generation rules.
 *
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1}
 * @see {http://tools.ietf.org/html/rfc3261#section-12.2.1.1}
 *
 * @see {jssip.sip.protocol.feature.UserAgentClient#createRequest}
 * @param {string} method The SIP request method.
 * @param {!jssip.sip.protocol.NameAddr} toNameAddr An addr-spec or name-addr
 *     for the logical recipient of this request. May be supplanted by Dialog
 *     info.
 * @param {!jssip.sip.protocol.NameAddr} fromNameAddr An addr-spec or name-addr
 *     for the logical sender of this request. May be supplanted by Dialog info.
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog The dialog this request
 *     exists inside of.
 * @return {!jssip.message.BuilderMessageContext}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.createRequest =
    function(method, toNameAddr, fromNameAddr, opt_dialog) {
  var rfc3261 = jssip.sip.protocol.rfc3261;
  var messageBuilder = new jssip.message.Message.Builder();
  /** @type {!Object.<string|!Array.<string>>} */
  var headerMap = {};

  messageBuilder.setSipVersion(rfc3261.SIP_VERSION);
  messageBuilder.setMethod(method);

  var computedRequestUri = this.computeRequestUri_(toNameAddr, opt_dialog);
  messageBuilder.setRequestUri(computedRequestUri.stringify());

  var computedRoutes = this.computeRoutesForRequest_(
      this.getSipContext().getPreloadedRouteSet(), opt_dialog);
  if (computedRoutes.length) {
    headerMap[rfc3261.HeaderType.ROUTE] = [];
    for(var i = 0; i < computedRoutes.length; i++) {
      headerMap[rfc3261.HeaderType.ROUTE].push(computedRoutes[i].stringify());
    }
  }

  headerMap[rfc3261.HeaderType.CONTACT] = this.computeRequestContact_(
      computedRequestUri, computedRoutes).stringify();
  headerMap[rfc3261.HeaderType.TO] = this.computeToNameAddr_(
      toNameAddr, true /* isRequest */, opt_dialog).stringify();
  headerMap[rfc3261.HeaderType.FROM] = this.computeFromNameAddr_(
      fromNameAddr, true /* isRequest */, opt_dialog).stringify();
  headerMap[rfc3261.HeaderType.CALL_ID] = this.computeCallId_(opt_dialog);
  headerMap[rfc3261.HeaderType.CSEQ] = this.computeCSeq_(method, opt_dialog);
  headerMap[rfc3261.HeaderType.MAX_FORWARDS] =
      jssip.sip.protocol.rfc3261.MAX_FORWARDS;

  for (var headerName in headerMap) {
    messageBuilder.setHeader(headerName, headerMap[headerName]);
  }

  var builderMessageContext = new jssip.message.BuilderMessageContext(
      messageBuilder, this.computeIsStrictRouting_(opt_dialog),
      this.getFeatureContext().getParserRegistry(), this.getSipContext());
  this.dispatchEvent(this.createEvent_(builderMessageContext,
      jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST));
  return builderMessageContext;
};


/**
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {boolean} Whether this message is strict routing.
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeIsStrictRouting_ =
    function(opt_dialog) {
  return !!opt_dialog && opt_dialog.getRouteSet().isFirstRouteStrict();
};


/**
 * @param {!jssip.sip.protocol.NameAddr} toNameAddr
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {!jssip.uri.Uri}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeRequestUri_ =
    function(toNameAddr, opt_dialog) {
  if (opt_dialog) {
    var routeSet = opt_dialog.getRouteSet();
    if (routeSet.isFirstRouteStrict()) {
      var strictRoute = routeSet.getRoutes()[0];
      return strictRoute.getNameAddr().getUri();
    }
    return opt_dialog.getRemoteTarget();
  }
  return toNameAddr.getUri();
};


/**
 * Returns an array of routes to use in the creation of a new request. If a
 * dialog is provided the route set will be returned from there as described in
 * {@link http://tools.ietf.org/html/rfc3261#section-12.2.1.1} otherwise the
 * routes from {@code preloadedRoutes} will be used.
 *
 * @param {!jssip.sip.protocol.RouteSet} preloadedRouteSet
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {!Array.<!jssip.sip.protocol.Route>}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeRoutesForRequest_ =
    function(preloadedRouteSet, opt_dialog) {
  if (opt_dialog) {
    var routeSet = opt_dialog.getRouteSet();
    var routes = routeSet.getRoutes();
    if (routeSet.isFirstRouteStrict()) {
      // The first route in the set is strict so it is being used as the request
      // URI.  Remove it from the route set and add the original request uri to
      // the end.
      routes.shift();
      routes.push(new jssip.sip.protocol.Route(
          new jssip.sip.protocol.NameAddr(opt_dialog.getRemoteTarget())));
    }
    return routes;
  }
  if (preloadedRouteSet.isFirstRouteStrict()) {
    // The RFC doesn't cover what to use as the request URI in this case so just
    // don't let it happen.
    throw new Error(
        'Cannot use a strict route as first route in preloaded routes');
  }
  return preloadedRouteSet.getRoutes();
};


/**
 * Gets the To name addr from the dialog or returns the provided to name
 * addr.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.2}
 * @see {http://tools.ietf.org/html/rfc3261#section-20.39}
 * @param {!jssip.sip.protocol.NameAddr} toNameAddr
 * @param {boolean} isRequest
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {!jssip.sip.protocol.NameAddr}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeToNameAddr_ =
    function(toNameAddr, isRequest, opt_dialog) {
  if (opt_dialog) {
    return opt_dialog.getToNameAddr(isRequest);
  }
  return toNameAddr;
};


/**
 * Gets the From name addr from the dialog or returns the provided from name
 * addr.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.3}
 * @see {http://tools.ietf.org/html/rfc3261#section-20.20}
 * @param {!jssip.sip.protocol.NameAddr} fromNameAddr
 * @param {boolean} isRequest
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {!jssip.sip.protocol.NameAddr}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeFromNameAddr_ =
    function(fromNameAddr, isRequest, opt_dialog) {
  if (opt_dialog) {
    return opt_dialog.getFromNameAddr(isRequest);
  }
  var tagParamMap = {
    tag: this.generateTag_()
  };
  return fromNameAddr.cloneWithAdditionalParameters(tagParamMap);
};


/**
 * Gets the Call-ID from the dialog if provided or generates a new Call-ID.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.4}
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {string} A call id.
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeCallId_ =
    function(opt_dialog) {
  if (opt_dialog) {
    return opt_dialog.getCallId();
  }
  return this.generateHexDigest_().substring(0, 32);
};


/**
 * Gets the CSeq from the dialog or generates a new one.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @param {string} method
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog
 * @return {string} A CSeq.
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeCSeq_ =
    function(method, opt_dialog) {
  var cseq = opt_dialog ? opt_dialog.getLocalSequenceNumber() + 1: 1;
  return '' + cseq + ' ' + method;
};


/**
 * Computes a Contact for use in a request from the given the request URI and
 * route list.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.8}
 * @see {http://tools.ietf.org/html/rfc3261#section-20.10}
 * @param {!jssip.uri.Uri} requestUri
 * @param {!Array.<!jssip.sip.protocol.Route>} routeList
 * @return {!jssip.sip.protocol.NameAddr}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.computeRequestContact_ =
    function(requestUri, routeList) {
  var SIPS = jssip.uri.Uri.Scheme.SIPS;
  var requestUriSchemeIsSecure = requestUri.getScheme() == SIPS;
  var firstRoute = routeList[0];
  var firstRouteSchemeIsSecure =
      firstRoute && firstRoute.getNameAddr().getUri().getScheme() == SIPS;
  return this.getSipContext().getContact(
      requestUriSchemeIsSecure || firstRouteSchemeIsSecure);
};


/**
 * Gets a set of destinations to send the message off to then sends the request
 * to the destinations. Async bits ahead, beware of dragons.
 *
 * @see {jssip.sip.protocol.feature.UserAgentClient#sendRequest}
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @return {!jssip.async.Promise.<boolean>}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.sendRequest =
    function(requestMessageContext) {
  goog.asserts.assert(
      requestMessageContext.isRequest() && requestMessageContext.isLocal());

  var promiseOfDestinations = this.messageDestinationFetcher_.
      fetchDestinationsForRequest(requestMessageContext);
  // TODO: the compiler isn't type checking the goog.bind param here, but I
  // believe it should due to this discussion:
  // http://code.google.com/p/closure-compiler/issues/detail?id=621 find out
  // what is going on.
  return promiseOfDestinations.thenBranch(
      goog.bind(this.sendRequestToDestinations_, this, requestMessageContext));
};


/**
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @param {!Array.<!jssip.sip.protocol.MessageDestination>} messageDestinations
 * @return {!jssip.async.Promise.<boolean>}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.sendRequestToDestinations_ =
    function(requestMessageContext, messageDestinations) {
  var destination = messageDestinations.shift();
  if (!destination) {
    throw new Error('No destination for request');
  }

  var promiseOfSendSuccess = this.transportLayer_.sendRequest(
      destination, requestMessageContext, this.generateBranchId_());
  // Attaches a handler to keep trying message destinations until the send is
  // successful or there are no more destinations.
  promiseOfSendSuccess.then(goog.bind(this.handleSendRequestResult_,
      this, requestMessageContext, messageDestinations))

  return promiseOfSendSuccess;
};


/**
 * If the transport layer sent the message, or there are no more message
 * destinations then return the result of the transport layer restul.  Otherwise
 * try the next message destination.
 *
 * Here be dragons. {@see jssip.async.Promise#then}
 *
 * @param {!jssip.message.MessageContext} messageContext
 * @param {!Array.<!jssip.sip.protocol.MessageDestination>} moreDestinations
 * @param {boolean|!jssip.async.Promise.<boolean>} wasRequestSent I don't think
 *     this can actually take in a Promise, and that this is only necessary to
 *     make the compiler not bitch. See TODO below.
 * @return {boolean|!jssip.async.Promise.<boolean>}
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.handleSendRequestResult_ =
    function(messageContext, moreDestinations, wasRequestSent) {
  if (wasRequestSent instanceof jssip.async.Promise) {
    // TODO: This was only added to stop compiler errors on the type signature
    // of this function, with respect to how it is registered above in
    // {@code #sendRequestToDestinations_}.  Find out if this ever happens.
    throw Error('This should never happen');
  }

  if (wasRequestSent || !moreDestinations.length) {
    return wasRequestSent;
  }
  return this.sendRequestToDestinations_(messageContext, moreDestinations);
};


/**
 * Generate a tag for From and To headers
 * @see {http://tools.ietf.org/html/rfc3261#section-19.3}
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.UserAgentFeature.prototype.generateTag_ = function() {
  // I am arbitrarily choosing length 7!
  return this.generateHexDigest_().substring(0, 7);
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
    function(method, toNameAddr, fromNameAddr, opt_dialog) {
  return this.delegate_.
      createRequest(method, toNameAddr, fromNameAddr, opt_dialog);
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
