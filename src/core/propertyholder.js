goog.provide('jssip.core.PropertyHolder');

goog.require('goog.Disposable');
goog.require('goog.dispose');
goog.require('goog.structs.Map');



/**
 * An immutable map that provides access to stored properties.
 * @param {!Object.<string, *>} propertyMap
 * @constructor
 * @extends {goog.Disposable}
 */
jssip.core.PropertyHolder = function(propertyMap) {
  /** @private {!goog.structs.Map} */
  this.propertyMap_ = new goog.structs.Map(propertyMap);
};
goog.inherits(jssip.core.PropertyHolder, goog.Disposable);


/**
 * Gets a value from the property map.
 * @param {string} key
 * @return {*}
 */
jssip.core.PropertyHolder.prototype.get = function(key) {
  return this.propertyMap_.get(key);
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
  return other instanceof this.constructor &&
      this.propertyMap_.equals(other.propertyMap_);
};


/** @override */
jssip.core.PropertyHolder.prototype.disposeInternal = function() {
  this.propertyMap_.clear();
  this.propertyMap_ = null;
};
