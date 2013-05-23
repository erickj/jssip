goog.provide('jssip.plugin.FeatureContext');



/**
 * Provides resources from the user agent to features.
 * @interface
 */
jssip.plugin.FeatureContext = function() {};


/**
 * @param {string} name The feature name.
 * @return {boolean} Whether a feature is activated.
 */
jssip.plugin.FeatureContext.prototype.isFeatureActive = function(name) {};


/**
 * Gets the feature delegate for the named feature.
 * @param {string} name The feature name.
 * @return {!jssip.plugin.FeatureDelegate} The feature delegate.
 */
jssip.plugin.FeatureContext.prototype.getDelegateForFeature = function(name) {};


/**
 * Gets the event bus for the user agent.
 * @return {!jssip.core.EventBus} The event bus.
 */
jssip.plugin.FeatureContext.prototype.getEventBus = function() {};


/**
 * Gets the parser registry for the user agent.
 * @return {!jssip.ParserRegistry} The registry.
 */
jssip.plugin.FeatureContext.prototype.getParserRegistry = function() {};
