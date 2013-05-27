goog.provide('jssip.core.PropertyHolder');

goog.require('goog.Disposable');
goog.require('goog.dispose');
goog.require('goog.structs.Map');



/**
 * An immutable map that provides access to stored properties.
 * @param {!Object.<string, *>=} opt_propertyMap
 * @param {boolean=} opt_isImmutable Whether or not this property holder is
 *     immutable. The default is true.
 * @constructor
 * @extends {goog.Disposable}
 */
jssip.core.PropertyHolder = function(opt_propertyMap, opt_isImmutable) {
  /** @private {!goog.structs.Map} */
  this.propertyMap_ = new goog.structs.Map(opt_propertyMap);

  /** @private {boolean} */
  this.isImmutable_ = goog.isDefAndNotNull(opt_isImmutable) ?
      !!opt_isImmutable : true;
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
 * Sets a key-value pair on the property map.
 * @param {string} key
 * @param {*} value
 * @throws {Error} If this property holder is immutable.
 */
jssip.core.PropertyHolder.prototype.set = function(key, value) {
  if (this.isImmutable_) {
    throw Erorr('Unable to set value on immutable property holder');
  }
  this.propertyMap_.set(key, value);
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
