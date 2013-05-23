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
 * Returns the set of features that this plugin provides.
 * @return {!jssip.plugin.FeatureSet} The feature set.
 */
jssip.plugin.Plugin.prototype.getFeatureSet = function() {};
