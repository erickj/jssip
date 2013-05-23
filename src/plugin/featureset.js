goog.provide('jssip.plugin.FeatureSet');

goog.require('goog.structs.Set');



/**
 * An immutable set of features.
 * @param {!Array.<!jssip.plugin.Feature>} features The features in this set.
 * @constructor
 */
jssip.plugin.FeatureSet = function(features) {
  /**
   * @private {!goog.structs.Set}
   */
  this.set_ = new goog.structs.Set();

  for (var i = 0; i < features.length; i++) {
    this.set_.add(features[i]);
  }
};


/**
 * Gets the set of features.
 * @return {!goog.structs.Set} The feature set.
 */
jssip.plugin.FeatureSet.prototype.getSet = function() {
  return this.set_.clone();
};
