goog.provide('jssip.util.Serializable');



/**
 * @interface
 */
jssip.util.Serializable = function() {};


/** @return {*} */
jssip.util.Serializable.prototype.serialize = goog.abstractMethod;


/**
 * For use with a registry on deserialization.
 * @return {string} */
jssip.util.Serializable.prototype.getSerializedType = goog.abstractMethod;
