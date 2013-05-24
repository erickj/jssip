goog.provide('jssip.core.PropertyHolder');

goog.require('goog.Disposable');
goog.require('goog.dispose');
goog.require('goog.object');



/**
 * An immutable map that provides access to stored properties.
 * @param {!Object.<string, *>} propertyMap
 * @constructor
 * @extends {goog.Disposable}
 */
jssip.core.PropertyHolder = function(propertyMap) {
  /** @private {!Object.<string, *>} */
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


/**
 * Whether or not this is equal to another property holder.
 * @param {!jssip.core.PropertyHolder} other
 * @return {boolean}
 */
jssip.core.PropertyHolder.prototype.equals = function(other) {
  if (this === other) {
    return true;
  }

  var isEqual = other instanceof this.constructor &&
      goog.object.getCount(this.propertyMap_) ===
          goog.object.getCount(other.propertyMap_);
  if (isEqual) {
    for (var key in this.propertyMap_) {
      isEqual = isEqual && this.propertyMap_[key] === other.propertyMap_[key];
      if (!isEqual) {
        break;
      }
    }
  }
  return isEqual;
};


/** @override */
jssip.core.PropertyHolder.prototype.disposeInternal = function() {
  for (var key in this.propertyMap_) {
    goog.dispose(this.propertyMap_[key]);
  }
  this.propertyMap_ = null;
};
