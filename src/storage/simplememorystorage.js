goog.provide('jssip.storage.SimpleMemoryStorage');

goog.require('jssip.storage.Storage');


/**
 * A simple in memory key-value store.
 *
 * @constructor
 * @implements {jssip.storage.Storage}
 */
jssip.storage.SimpleMemoryStorage = function() {
  /** @private {!Object.<jssip.util.Serializable>} */
  this.table_ = {};
};


/** @override */
jssip.storage.SimpleMemoryStorage.prototype.get = function(key) {
  return this.table_.hasOwnProperty(key) ? this.table_[key] : undefined;
};


/** @override */
jssip.storage.SimpleMemoryStorage.prototype.set = function(key, value) {
  this.table_[key] = value;
};


/** @override */
jssip.storage.SimpleMemoryStorage.prototype.remove = function(key) {
  delete this.table_[key];
};
