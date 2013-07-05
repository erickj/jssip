goog.provide('jssip.storage.Storage');



/**
 * @interface
 */
jssip.storage.Storage = function() {};


/**
 * Gets an item from storage
 *
 * @param {string} key The key to get.
 * @return {jssip.util.Serializable|undefined} The stored value or undefined if
 *     not found.
 */
jssip.storage.Storage.prototype.get = goog.abstractMethod;


/**
 * Sets an item into storage.
 *
 * @param {string} key
 * @param {jssip.util.Serializable} value
 */
jssip.storage.Storage.prototype.set = goog.abstractMethod;


/**
 * Removes an item from storage.
 *
 * @param {string} key
 */
jssip.storage.Storage.prototype.remove = goog.abstractMethod;
