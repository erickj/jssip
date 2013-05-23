goog.provide('jssip.plugin.AbstractPlugin');

goog.require('jssip.plugin.Plugin');



/**
 * Base type for plugins
 * @param {string} name The plugin name.
 * @param {!jssip.plugin.FeaureSet} featureSet The feature set.
 * @constructor
 * @implements {jssip.plugin.Plugin}
 */
jssip.plugin.AbstractPlugin = function(name, featureSet) {
  /** @private {string} */
  this.name_ = name;

  /** @private {!jssip.plugin.FeatureSet} */
  this.featureSet_ = featureSet;
};


/** @override */
jssip.plugin.AbstractPlugin.prototype.getName = function() {
  return this.name_;
};


/** @override */
jssip.plugin.AbstractPlugin.prototype.getFeatureSet = function() {
  return this.featureSet_;
};
