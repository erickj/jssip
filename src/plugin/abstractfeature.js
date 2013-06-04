goog.provide('jssip.plugin.AbstractFeature');

goog.require('jssip.event.EventBus');
goog.require('jssip.plugin.Feature');
goog.require('jssip.plugin.Feature.Event');



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
 * @param {!Object.<!jssip.message.HeaderParserFactory>=}
 *     opt_headerParserFactoryMap The header parser factory map.
 * @param {!Object.<!jssip.uri.UriParserFactory>=} opt_uriParserFactoryMap
 *     The uri parser factory map.
 * @constructor
 * @implements {jssip.plugin.Feature}
 * @extends {jssip.event.EventBus}
 */
jssip.plugin.AbstractFeature = function(name, opt_featureFacade,
    opt_eventHandlerMap, opt_featureTypes, opt_headerParserFactoryMap,
    opt_uriParserFactoryMap) {
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

  /** @private {!Object.<!jssip.message.HeaderParserFactory>} */
  this.headerParserFactoryMap_ = opt_headerParserFactoryMap || {};

  /** @private {!Object.<!jssip.uri.UriParserFactory>} */
  this.uriParserFactoryMap_ = opt_uriParserFactoryMap || {};
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
  this.dispatchEvent(jssip.plugin.Feature.Event.ACTIVATED);
};


/**
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @private
 */
jssip.plugin.AbstractFeature.prototype.registerParsers_ =
    function(parserRegistry) {
  for (var header in this.headerParserFactoryMap_) {
    if (!parserRegistry.registerHeaderParserFactory(
        header, this.headerParserFactoryMap_[header])) {
      throw new Error('Unable to register header parser factory ' + header +
          ' for feature ' + this.getName());
    }
  }

  for (var scheme in this.uriParserFactoryMap_) {
    if (!parserRegistry.registerUriParserFactory(
        scheme, this.uriParserFactoryMap_[scheme])) {
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
