goog.provide('jssip.plugin.Plugin');



/**
 * A plugin is the manner by which extensions are made to JSSIP.  Each
 * RFC implementation for instance probably warrants its own plugin. A
 * plugin provides one or more features.
 *
 * @interface
 */
jssip.plugin.Plugin = function() {
};


/**
 * The plugin name.
 * @return {string} The name.
 */
jssip.plugin.Plugin.prototype.getName = function() {};


/**
 * Returns a new set of features that this plugin provides. Each call to this
 * function should generate a new feature set instance and new feature
 * instances.
 * @return {!jssip.plugin.FeatureSet} The feature set.
 */
jssip.plugin.Plugin.prototype.generateFeatureSet = function() {};
