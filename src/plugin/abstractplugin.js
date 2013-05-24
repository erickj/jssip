goog.provide('jssip.plugin.AbstractPlugin');

goog.require('jssip.plugin.Plugin');



/**
 * Base type for plugins
 * @param {string} name The plugin name.
 * @param {function(): !jssip.plugin.FeatureSet} featureSetFactory A
 *     factory function that will generate this plugins feature set.
 * @constructor
 * @implements {jssip.plugin.Plugin}
 */
jssip.plugin.AbstractPlugin = function(name, featureSetFactory) {
  /** @private {string} */
  this.name_ = name;

  /** @private {function(): !jssip.plugin.FeatureSet} */
  this.featureSetFactory_ = featureSetFactory;
};


/** @override */
jssip.plugin.AbstractPlugin.prototype.getName = function() {
  return this.name_;
};


/** @override */
jssip.plugin.AbstractPlugin.prototype.generateFeatureSet = function() {
  return this.featureSetFactory_();
};
