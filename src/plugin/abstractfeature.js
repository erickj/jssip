goog.provide('jssip.plugin.AbstractFeature');

goog.require('jssip.event.EventBus');
goog.require('jssip.plugin.Feature');



/**
 * Base type for features.
 * List of events fired in the order in which they fire;
 *
 *   ACTIVATED - after all activation code has run
 *
 * @param {string} name The event name.
 * @param {!jssip.plugin.FeatureFacade=} opt_featureFacade An optional
 *     feature facade.
 * @param {!Object.<!Function|!Object>=} opt_eventHandlerMap A map of event
 *     names to handler functions or event handler listeners,
 *     {@see goog.events.EventTarget#addEventListener}.  These will be
 *     automatically registered with the feature context event bus upon
 *     activation.
 * @param {!Array.<string>=} opt_featureTypes An optional array of feature types
 *     that this feature will register for when activated.
 * @param {!Array.<string>=} opt_headers The headers this feature will provide a
 *     header parser factory for.
 * @param {!Array.<string>=} opt_uriSchemes The URI schemes this feature will
 *     provide a parser factory for.
 * @constructor
 * @implements {jssip.plugin.Feature}
 * @extends {jssip.event.EventBus}
 */
jssip.plugin.AbstractFeature = function(name, opt_featureFacade,
    opt_eventHandlerMap, opt_featureTypes, opt_headers, opt_uriSchemes) {
  goog.base(this);

  /** @private {string} */
  this.name_ = name;

  /** @private {jssip.plugin.FeatureFacade} */
  this.featureFacade_ = goog.isDef(opt_featureFacade) ?
      opt_featureFacade : null;

  /** @private {!Object.<!Function|!Object>} */
  this.eventHandlerMap_ = opt_eventHandlerMap || {};

  /** @private {jssip.plugin.FeatureContext} */
  this.feaureContext_ = null;

  /** @private {boolean} */
  this.isActive_ = false;

  /** @private {!Array.<string>} */
  this.featureTypes_ = opt_featureTypes || [];

  /** @private {!Array.<string>} */
  this.headers_ = opt_headers || [];

  /** @private {!Array.<string>} */
  this.uriSchemes_ = opt_uriSchemes || [];
};
goog.inherits(jssip.plugin.AbstractFeature, jssip.event.EventBus);


/** @override */
jssip.plugin.AbstractFeature.prototype.getName = function() {
  return this.name_;
};


/**
 * @override
 * @throws {Error} If feature facade is null.
 */
jssip.plugin.AbstractFeature.prototype.getFeatureFacade = function() {
  if (!this.featureFacade_) {
    throw Error('Feature facade not set for feature ' + this.name_);
  }
  return this.featureFacade_;
};


/** @override */
jssip.plugin.AbstractFeature.prototype.isActive = function() {
  return this.isActive_;
};


/** @override */
jssip.plugin.AbstractFeature.prototype.activate = function(featureContext) {
  if (this.isActive_) {
    throw Error('Unable to activate active feature ' + this.name_);
  }

  this.featureContext_ = featureContext;

  // Register event handlers and sets up event target chain.
  var eventBus = featureContext.getEventBus();
  for (var eventType in this.eventHandlerMap_) {
    eventBus.addEventListener(eventType, this.eventHandlerMap_[eventType]);
  }
  this.setParentEventTarget(eventBus);

  // Register custom header and uri parsers.
  this.registerParsers_(featureContext.getParserRegistry());

  // Register for feature types
  for (var i = 0; i < this.featureTypes_.length; i++) {
    featureContext.registerFeatureForType(this.featureTypes_[i], this);
  }

  this.isActive_ = true;
  this.onActivated();
  this.dispatchEvent(jssip.plugin.Feature.Event.ACTIVATED);
};


/**
 * Hook for subclasses to perform internal setup on activation.
 * @protected
 */
jssip.plugin.AbstractFeature.prototype.onActivated = goog.nullFunction;


/**
 * This protected getter is used during activation to register the header parser
 * factory that this feature provides.  It should not be called until activation
 * so that implementors have a handle on the feature context, and thus the event
 * bus.
 * @param {string} headerName
 * @return {!jssip.message.HeaderParserFactory}
 * @protected
 */
jssip.plugin.AbstractFeature.prototype.getHeaderParserFactory =
    goog.abstractMethod;


/**
 * This protected getter is used during activation to register the uri scheme
 * parser factory that this feature provides.  It should not be called until
 * activation so that implementors have a handle on the feature context, and
 * thus the event bus.
 * @param {string} uriScheme
 * @return {!jssip.uri.UriParserFactory}
 * @protected
 */
jssip.plugin.AbstractFeature.prototype.getUriParserFactory =
    goog.abstractMethod;


/**
 * Internal accessor for the platform context.
 * @return {!jssip.platform.PlatformContext}
 * @protected
 */
jssip.plugin.AbstractFeature.prototype.getPlatformContext = function() {
  return this.getFeatureContext().getPlatformContext();
};


/**
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @private
 */
jssip.plugin.AbstractFeature.prototype.registerParsers_ =
    function(parserRegistry) {
  for (var i = 0; i < this.headers_.length; i++) {
    var header = this.headers_[i];
    if (!parserRegistry.registerHeaderParserFactory(
        header, this.getHeaderParserFactory(header))) {
      throw new Error('Unable to register header parser factory ' + header +
          ' for feature ' + this.getName());
    }
  }

  for (i = 0; i < this.uriSchemes_.length; i++) {
    var scheme = this.uriSchemes_[i];
    if (!parserRegistry.registerUriParserFactory(
        scheme, this.getUriParserFactory(scheme))) {
      throw new Error('Unable to register URI parser factory ' + scheme +
          ' for feature ' + this.getName());
    }
  }
};


/**
 * Returns the feature context if set or throws otherwise.
 * @return {!jssip.plugin.FeatureContext} The feature context.
 * @protected
 * @throws {Error}
 */
jssip.plugin.AbstractFeature.prototype.getFeatureContext = function() {
  if (!this.featureContext_) {
    throw Error('Unable to get feature context for feature' + this.name_);
  }
  return this.featureContext_;
};
