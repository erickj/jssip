goog.provide('jssip.core.UserAgent');
goog.provide('jssip.core.UserAgent.Config');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.structs.Set');
goog.require('jssip.core.EventBus');
goog.require('jssip.core.PropertyHolder');
goog.require('jssip.message.MessageContext');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.net.TransportEvent');
goog.require('jssip.net.TransportManager');
goog.require('jssip.parser.ParserRegistry');
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
 * @param {!jssip.net.TransportManager} transportManager
 * @constructor
 */
jssip.core.UserAgent =
    function(plugins, config, parentEventBus, transportManager) {
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

  /** @private {!jssip.net.TransportManager} */
  this.transportManager_ = transportManager;

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = new jssip.parser.ParserRegistry(
      new jssip.message.MessageParserFactory(this.eventBus_), this.eventBus_);

  var requiredFeatureTypes = [
    jssip.core.UserAgent.CoreFeatureType.USERAGENTCLIENT,
    jssip.core.UserAgent.CoreFeatureType.USERAGENTSERVER,
    jssip.core.UserAgent.CoreFeatureType.MEDIAOFFERANSWER
  ];

  /** @private {!jssip.plugin.FeatureContextImpl} */
  this.featureContext_ = new jssip.plugin.FeatureContextImpl(
      this.availableFeatureSet_, this.eventBus_, this.parserRegistry_,
      requiredFeatureTypes, this.config_);
};


/** @enum {string} */
jssip.core.UserAgent.CoreFeatureType = {
  USERAGENTCLIENT: 'useragentclient',
  USERAGENTSERVER: 'useragentserver',
  MEDIAOFFERANSWER: 'mediaofferanswer'
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
  this.setupHandlers_();
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
  this.featureContext_.finalize();
  this.parserRegistry_.finalize();
  this.eventBus_.dispatchEvent(jssip.core.UserAgent.Event.FEATURESACTIVATED);
};


/**
 * Sets up event handlers and callbacks.
 * @private
 */
jssip.core.UserAgent.prototype.setupHandlers_ = function() {
  this.transportManager_.addEventListener(
      jssip.net.TransportManager.EventType.MESSAGE,
      goog.bind(this.handleTransportMesssage_, this));
};


// TODO(erick): Figure out how to restructure so I don't need the @suppress
/**
 * Handles raw inbound messages from the transport manager.  Requests are handed
 * to the user agent client and response to the user agent server.
 * @param {!jssip.net.TransportEvent} event
 * @suppress {invalidCasts}
 * @private
 */
jssip.core.UserAgent.prototype.handleTransportMesssage_ = function(event) {
  var messageContext =
      new jssip.message.MessageContext(event.message, this.parserRegistry_);

  if (messageContext.getMessage().isRequest()) {
    var uas = /** @type {!jssip.core.feature.UserAgentServer} */ (
        this.featureContext_.getFacadeByType(
            jssip.core.UserAgent.CoreFeatureType.USERAGENTSERVER));
    uas.handleRequest(messageContext);
  } else {
    var uac = /** @type {!jssip.core.feature.UserAgentClient} */ (
        this.featureContext_.getFacadeByType(
            jssip.core.UserAgent.CoreFeatureType.USERAGENTCLIENT));
    uac.handleResponse(messageContext);
  }
};


/** @enum {string} */
jssip.core.UserAgent.ConfigProperty = {
  ADDRESS_OF_RECORD: 'aor',
  OUTBOUND_PROXY: 'outboundproxy'
};


/**
 * @param {!Array.<string>} featureNames The names of features to activate.
 * @param {!Object.<jssip.core.UserAgent.ConfigProperty, string>} properties
 *     The configuration property map.
 * @constructor
 * @extends {jssip.core.PropertyHolder}
 */
jssip.core.UserAgent.Config = function(featureNames, properties) {
  goog.base(this, properties);

  /** @private {!Array.<string>} */
  this.featureNames_ = featureNames;
};
goog.inherits(jssip.core.UserAgent.Config, jssip.core.PropertyHolder);


/** @return {!Array.<string>} The features to activate. */
jssip.core.UserAgent.Config.prototype.getFeatureNames = function() {
  return this.featureNames_;
};
