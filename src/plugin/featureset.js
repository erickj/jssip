goog.provide('jssip.plugin.FeatureSet');

goog.require('goog.structs.Set');



/**
 * An immutable set of features.  If multiple features with the same name are
 * registered then an error is thrown.
 * @param {!Array.<!jssip.plugin.Feature>} features The features in this set.
 * @constructor
 * @throws {Error}
 */
jssip.plugin.FeatureSet = function(features) {
  /** @private {!Object.<!jssip.plugin.Feature>} */
  this.featureMap_ = {};

  /** @private {!goog.structs.Set} */
  this.set_ = new goog.structs.Set();

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];
    var name = feature.getName();
    if (this.featureMap_[name]) {
      throw Error('Already registered feature with name ' + name);
    }
    this.featureMap_[name] = feature;
    this.set_.add(feature);
  }
};


/**
 * Gets the named feature or null.
 * @param {string} name The feature name.
 * @return {jssip.plugin.Feature} Returns null if there is no feature.
 */
jssip.plugin.FeatureSet.prototype.getFeatureByName = function(name) {
  return this.featureMap_[name] || null;
};


/**
 * Gets the set of features.
 * @return {!goog.structs.Set} The feature set.
 */
jssip.plugin.FeatureSet.prototype.getSet = function() {
  return this.set_.clone();
};
