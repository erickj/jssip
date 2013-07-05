goog.provide('jssip.sip.UserAgent');
goog.provide('jssip.sip.UserAgent.Config');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.structs.Set');
goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.plugin.FeatureContextImpl');
goog.require('jssip.plugin.FeatureSet');
goog.require('jssip.sip.protocol.feature');
goog.require('jssip.util.PropertyHolder');



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
 * @param {!jssip.sip.UserAgent.Config} config The config.
 * @param {!jssip.event.EventBus} parentEventBus The parent of the user agents
 *     event bus.
 * @param {!jssip.platform.PlatformContext} platformContext
 * @constructor
 */
jssip.sip.UserAgent =
    function(plugins, config, parentEventBus, platformContext) {
  /** @private {!Array.<!jssip.plugin.Plugin>} */
  this.availablePlugins_ = plugins;

  var set = new goog.structs.Set();
  for (var i = 0; i < plugins.length; i++) {
    set.addAll(plugins[i].generateFeatureSet().getSet());
  }
  /** @private {!jssip.plugin.FeatureSet} */
  this.availableFeatureSet_ = new jssip.plugin.FeatureSet(set.getValues());

  /** @private {!jssip.sip.UserAgent.Config} */
  this.config_ = config;

  /** @private {!jssip.event.EventBus} */
  this.eventBus_ = new jssip.event.EventBus(parentEventBus);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = new jssip.parser.ParserRegistry(
      new jssip.message.MessageParserFactory(this.eventBus_), this.eventBus_);

  var requiredFeatureTypes = [
    jssip.sip.protocol.feature.CoreType.USERAGENTCLIENT,
    jssip.sip.protocol.feature.CoreType.USERAGENTSERVER,
    jssip.sip.protocol.feature.CoreType.TRANSPORTLAYER
  ];

  /** @private {!jssip.plugin.FeatureContextImpl} */
  this.featureContext_ = new jssip.plugin.FeatureContextImpl(
      this.availableFeatureSet_, this.eventBus_, this.parserRegistry_,
      requiredFeatureTypes, this.config_, platformContext);
};


/** @enum {string} */
jssip.sip.UserAgent.Event = {
  LOADSTART: 'useragentloadstart',
  LOADEND: 'useragentloadend',
  FEATURESACTIVATED: 'useragentfeaturesactivated'
};


/**
 * Begins the load process for the user agent.
 */
jssip.sip.UserAgent.prototype.load = function() {
  this.eventBus_.dispatchEvent(jssip.sip.UserAgent.Event.LOADSTART);
  this.activateFeatures_();
  this.eventBus_.dispatchEvent(jssip.sip.UserAgent.Event.LOADEND);
};


/**
 * Activates all features specified in the configuration.
 * @private
 */
jssip.sip.UserAgent.prototype.activateFeatures_ = function() {
  var names = this.config_.getFeatureNames();
  for (var i = 0; i < names.length; i++) {
    var feature = /** @type {!jssip.plugin.Feature} */ (goog.asserts.assert(
        this.availableFeatureSet_.getFeatureByName(names[i]),
        'Unable to activate feature ' + names[i]));
    feature.activate(this.featureContext_);
  }
  this.featureContext_.finalize();
  this.parserRegistry_.finalize();
  this.eventBus_.dispatchEvent(jssip.sip.UserAgent.Event.FEATURESACTIVATED);
};


/**
 * @see http://tools.ietf.org/html/rfc6011#section-3.1
 * @enum {string}
 */
jssip.sip.UserAgent.ConfigProperty = {
  ADDRESS_OF_RECORD: 'aor',
  DISPLAY_NAME: 'displayname',
  OUTBOUND_PROXY: 'outboundproxy',
  VIA_SENT_BY: 'viasentby',
  CONTACT: 'contact'
};



/**
 * @param {!Array.<string>} featureNames The names of features to activate.
 * @param {!Object.<jssip.sip.UserAgent.ConfigProperty, string>} properties
 *     The configuration property map.
 * @constructor
 * @extends {jssip.util.PropertyHolder}
 */
jssip.sip.UserAgent.Config = function(featureNames, properties) {
  goog.base(this, properties);

  /** @private {!Array.<string>} */
  this.featureNames_ = featureNames;
};
goog.inherits(jssip.sip.UserAgent.Config, jssip.util.PropertyHolder);


/** @return {!Array.<string>} The features to activate. */
jssip.sip.UserAgent.Config.prototype.getFeatureNames = function() {
  return this.featureNames_;
};
