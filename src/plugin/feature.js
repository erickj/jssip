goog.provide('jssip.plugin.Feature');
goog.provide('jssip.plugin.Feature.Event');



/**
 * A feature can provides new events to the system and a delegate for other
 * features to make API calls into.  A feature may also register new parsers for
 * additional headers and URI schemes, they can add processors for new method or
 * header support, and can expose new APIs to the endpoint and other features
 * via the delegate.
 *
 * @interface
 */
jssip.plugin.Feature = function() {};


/** @enum {string} */
jssip.plugin.Feature.Event = {
  ACTIVATED: 'featureactivated'
};


/**
 * @return {!Array.<string>} A list of event types emitted by this feature.
 */
jssip.plugin.Feature.prototype.getEventTypes = function() {};


/**
 * The feature name that will be used to access a feature delegate by other
 * features.
 * @return {string} The feature name.
 */
jssip.plugin.Feature.prototype.getName = function() {};


/**
 * @return {!jssip.plugin.FeatureDelegate} The feature delegate for
 *     access via the featureContext context.
 */
jssip.plugin.Feature.prototype.getFeatureDelegate = function() {};


/**
 * @return {boolean} Whether or not this feature is active.
 */
jssip.plugin.Feature.prototype.isActive = function() {};


/**
 * Activates a feature in a feature context.
 * @param {!jssip.plugin.FeatureContext} featureContext
 *     activated on.
 */
jssip.plugin.Feature.prototype.activate = function(featureContext) {};
