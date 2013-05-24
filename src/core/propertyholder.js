goog.provide('jssip.core.PropertyHolder');

goog.require('goog.Disposable');
goog.require('goog.dispose');



/**
 * An immutable map that provides access to stored properties.
 * @param {!Object.<string, *>} propertyMap
 * @constructor
 * @extends {goog.Disposable}
 */
jssip.core.PropertyHolder = function(propertyMap) {
  /** @private {!Object} */
  this.propertyMap_ = propertyMap;
};
goog.inherits(jssip.core.PropertyHolder, goog.Disposable);


/**
 * Gets a value from the property map.
 * @param {string} key
 * @return {*}
 */
jssip.core.PropertyHolder.prototype.get = function(key) {
  return this.propertyMap_[key];
};


/** @override */
jssip.core.PropertyHolder.prototype.disposeInternal = function() {
  for (var key in this.propertyMap_) {
    goog.dispose(this.propertyMap_[key]);
  }
  this.propertyMap_ = null;
};
