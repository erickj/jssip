goog.provide('jssip.plugin.FeatureContext');



/**
 * Provides resources from the user agent to features.
 * @interface
 */
jssip.plugin.FeatureContext = function() {};


// TODO(erick): May want to add a way to get registered feature types,
// so that clients don't have to guess what is registered.
/**
 * Registers a feature for a feature type in this context.  Throws an
 * error if a feature is already implemented for the given type.
 * @param {string} type The feature type.
 * @param {!jssip.plugin.Feature} feature The feature.
 * @throws {Error}
 */
jssip.plugin.FeatureContext.prototype.registerFeatureForType =
    function(type, feature) {};


/**
 * @param {string} name The feature name.
 * @return {boolean} Whether a feature is active.
 */
jssip.plugin.FeatureContext.prototype.isFeatureActive = function(name) {};


/**
 * @param {string} type The feature type.
 * @return {boolean} Whether a feature implementing the type is active.
 */
jssip.plugin.FeatureContext.prototype.isFeatureTypeActive = function(type) {};


/**
 * Gets the feature facade for the feature with the given name.
 * @param {string} name The feature name.
 * @return {!jssip.plugin.FeatureFacade} The feature facade.
 */
jssip.plugin.FeatureContext.prototype.getFacadeByName = function(name) {};


/**
 * Gets the feature facade for the registered feature type.
 * @param {string} type The feature type.
 * @return {!jssip.plugin.FeatureFacade} The feature facade.
 */
jssip.plugin.FeatureContext.prototype.getFacadeByType = function(type) {};


/**
 * Gets the event bus for the user agent.
 * @return {!jssip.core.EventBus} The event bus.
 */
jssip.plugin.FeatureContext.prototype.getEventBus = function() {};


/**
 * Gets the parser registry for the user agent.
 * @return {!jssip.parser.ParserRegistry} The registry.
 */
jssip.plugin.FeatureContext.prototype.getParserRegistry = function() {};
