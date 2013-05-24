goog.provide('jssip.core.UserAgent');
goog.provide('jssip.core.UserAgent.Config');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.structs.Set');
goog.require('jssip.ParserRegistry');
goog.require('jssip.core.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.plugin.FeatureContextImpl');
goog.require('jssip.plugin.FeatureSet');



/**
 * The user agent represents a single SIP configuration in the endpoint.
 * Responsibilities include activating features, providing a feature context,
 * and propagating events from features to the endpoint.
 *
 * List of events fired in the order in which they fire;
 *
 *   Event.LOADSTART - fired when loading begins
 *   Event.FEATURESACTIVATED - fired after all features are activated
 *   Event.LOADEND - fired once loading end
 *
 * @param {!Array.<!jssip.plugin.Plugin>} plugins The plugins array.
 * @param {!jssip.core.UserAgent.Config} config The config.
 * @param {!jssip.core.EventBus} parentEventBus The parent of the user agents
 *     event bus.
 * @constructor
 */
jssip.core.UserAgent = function(plugins, config, parentEventBus) {
  /** @private {!Array.<!jssip.plugin.Plugin>} */
  this.availablePlugins_ = plugins;

  var set = new goog.structs.Set();
  for (var i = 0; i < plugins.length; i++) {
    set.addAll(plugins[i].generateFeatureSet().getSet());
  }
  /** @private {!jssip.plugin.FeatureSet} */
  this.availableFeatureSet_ = new jssip.plugin.FeatureSet(set.getValues());

  /** @private {!jssip.core.UserAgent.Config} */
  this.config_ = config;

  /** @private {!jssip.core.EventBus} */
  this.eventBus_ = new jssip.core.EventBus(parentEventBus);

  /** @private {!jssip.ParserRegistry} */
  this.parserRegistry_ = new jssip.ParserRegistry(
      new jssip.message.MessageParserFactory());

  /** @private {!jssip.plugin.FeatureContextImpl} */
  this.featureContext_ = new jssip.plugin.FeatureContextImpl(
      this.availableFeatureSet_, this.eventBus_, this.parserRegistry_);
};


/** @enum {string} */
jssip.core.UserAgent.Event = {
  LOADSTART: 'useragentloadstart',
  LOADEND: 'useragentloadend',
  FEATURESACTIVATED: 'useragentfeaturesactivated'
};


/**
 * Begins the load process for the user agent.
 */
jssip.core.UserAgent.prototype.load = function() {
  this.eventBus_.dispatchEvent(jssip.core.UserAgent.Event.LOADSTART);
  this.activateFeatures_();
  this.eventBus_.dispatchEvent(jssip.core.UserAgent.Event.LOADEND);
};


/**
 * Activates all features specified in the configuration.
 * @private
 */
jssip.core.UserAgent.prototype.activateFeatures_ = function() {
  var names = this.config_.getFeatureNames();
  for (var i = 0; i < names.length; i++) {
    var feature = /** @type {!jssip.plugin.Feature} */ (goog.asserts.assert(
        this.availableFeatureSet_.getFeatureByName(names[i]),
        'Unable to activate feature ' + names[i]));
    feature.activate(this.featureContext_);
  }
  this.eventBus_.dispatchEvent(jssip.core.UserAgent.Event.FEATURESACTIVATED);
};



/**
 * @param {!Array.<string>} featureNames The names of features to activate.
 * @constructor
 */
jssip.core.UserAgent.Config = function(featureNames) {
  /** @private {!Array.<string>} */
  this.featureNames_ = featureNames;
};


/** @return {!Array.<string>} The features to activate. */
jssip.core.UserAgent.Config.prototype.getFeatureNames = function() {
  return /** @type {!Array.<string>} */ (goog.array.clone(this.featureNames_));
};
