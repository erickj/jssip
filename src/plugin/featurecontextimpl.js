goog.provide('jssip.plugin.FeatureContextImpl');


goog.require('jssip.plugin.FeatureContext');



/**
 * The default implementation of jssip.plugin.FeatureContext.
 * @param {!jssip.plugin.FeatureSet} featureSet The features available in this
 *     context.
 * @param {!jssip.core.EventBus} eventBus The event bus.
 * @param {!jssip.ParserRegistry} parserRegistry The parser registry.
 * @constructor
 * @implements {jssip.plugin.FeatureContext}
 */
jssip.plugin.FeatureContextImpl =
    function(featureSet, eventBus, parserRegistry) {
  /** @private {!jssip.plugin.FeatureSet} */
  this.featureSet_ = featureSet;

  /** @private {!jssip.core.EventBus} */
  this.eventBus_ = eventBus;

  /** @private {!jssip.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/**
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
jssip.plugin.FeatureContextImpl.prototype.getFacadeForFeature =
    function(name) {
  return this.getFeatureByName_(name).getFeatureFacade();
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getEventBus = function() {
  return this.eventBus_;
};


/** @override */
jssip.plugin.FeatureContextImpl.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};
