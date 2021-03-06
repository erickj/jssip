goog.provide('jssip.plugin.FeatureContextImpl');

goog.require('goog.asserts');
goog.require('jssip.plugin.FeatureContext');



/**
 * The default implementation of jssip.plugin.FeatureContext.
 * @param {!jssip.plugin.FeatureSet} featureSet The features available in this
 *     context.
 * @param {!jssip.event.EventBus} eventBus The event bus.
 * @param {!jssip.parser.ParserRegistry} parserRegistry The parser registry.
 * @param {!Array.<string>} requiredFeatureTypes An array of feature types that
 *     will be checked against the set of registered feature types when
 *     {@code finalize} is called.
 * @param {!jssip.sip.UserAgent.Config} userAgentConfig The user agent
 *     configuration.
 * @param {!jssip.platform.PlatformContext} platformContext The platform
 *     context.
 * @param {!jssip.sip.SipContext} sipContext The SIP context.
 * @constructor
 * @implements {jssip.plugin.FeatureContext}
 */
jssip.plugin.FeatureContextImpl = function(featureSet, eventBus, parserRegistry,
    requiredFeatureTypes, userAgentConfig, platformContext, sipContext) {
  /** @private {!jssip.plugin.FeatureSet} */
  this.featureSet_ = featureSet;

  /** @private {!jssip.event.EventBus} */
  this.eventBus_ = eventBus;

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;

  /** @private {!Object.<!jssip.plugin.Feature>} */
  this.featureTypeMap_ = {};

  /** @private {!Array.<string>} */
  this.requiredFeatureTypes_ = requiredFeatureTypes;

  /** @private {!jssip.sip.UserAgent.Config} */
  this.userAgentConfig_ = userAgentConfig;

  /** @private {!jssip.platform.PlatformContext} */
  this.platformContext_ = platformContext;

  /** @private {!jssip.sip.SipContext} */
  this.sipContext_ = sipContext;

  /** @private {boolean} */
  this.finalized_ = false;
};


/**
 * Gets the requested feature by name, throws an error if no feature is found or
 * that feature is not active.
 * @param {string} name The feature name.
 * @private
 * @return {!jssip.plugin.Feature}
 * @throws {Error}
 */
jssip.plugin.FeatureContextImpl.prototype.getFeatureByName_ = function(name) {
  var feature = this.featureSet_.getFeatureByName(name);
  if (!feature) {
    throw Error('Unable to locate feature ' + name);
  }
  return feature;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.isFeatureActive = function(name) {
  return this.getFeatureByName_(name).isActive();
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.isFeatureTypeActive = function(type) {
  var feature = this.featureTypeMap_[type];
  return !!feature && feature.isActive();
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getFacadeByName =
    function(name) {
  var feature = this.getFeatureByName_(name);
  goog.asserts.assert(feature.isActive());
  return feature.getFeatureFacade();
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getFacadeByType =
    function(type) {
  var feature = goog.asserts.assert(this.featureTypeMap_[type]);
  goog.asserts.assert(feature.isActive());
  return feature.getFeatureFacade();
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getEventBus = function() {
  return this.eventBus_;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getUserAgentConfigProperty =
    function(property) {
  var value = this.userAgentConfig_.get(property);
  goog.asserts.assert(goog.isString(value) || !goog.isDef(value));
  return goog.isString(value) ? value : null;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getPlatformContext =
    function() {
  return this.platformContext_;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getSipContext = function() {
  return this.sipContext_;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.registerFeatureForType =
    function(type, feature) {
  if (this.finalized_) {
    throw Error(
        'Unable to register feature for type. FeatureContext is finalized');
  }

  if (this.featureTypeMap_[type]) {
    throw Error('Feature ' + this.featureTypeMap_[type].getName() +
        ' already registered for type ' + type);
  }
  goog.asserts.assert(this.getFeatureByName_(feature.getName()) === feature,
      'Unable to register unknown feature instance for type ' + type);
  this.featureTypeMap_[type] = feature;
};


/**
 * Finalizes the registration stage of this feature context.  Any required
 * feature types will be checked to ensure a feature was registered for the
 * given type, otherwise throws an error.
 * @throws {Error}
 */
jssip.plugin.FeatureContextImpl.prototype.finalize = function() {
  if (this.finalized_) {
    throw Error('Unable to finalize, FeatureContext is already finalized');
  }
  var types = this.requiredFeatureTypes_;
  for (var i = 0; i < types.length; i++) {
    goog.asserts.assert(this.featureTypeMap_[types[i]],
        'No feature registered for type ' + types[i]);
  }

  for (var type in this.featureTypeMap_) {
    if (this.featureTypeMap_[type].isActive()) {
      this.featureTypeMap_[type].afterActivated();
    }
  }

  this.finalized_ = true;
};
