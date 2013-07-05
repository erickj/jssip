goog.provide('jssip.storage.SimpleMemoryStorageSpec');

goog.require('jssip.storage.SimpleMemoryStorage');

describe('jssip.storage.SimpleMemoryStorage', function() {
  var storage;

  beforeEach(function() {
    storage = new jssip.storage.SimpleMemoryStorage();
  });

  describe('#set, #get, and #remove', function() {
    var aSerializable = /** @type {!jssip.util.Serializable} */ ({});
    var key = 'a-key';

    it('sets, gets, and removes a value from the store', function() {
      // Check before adding it to the store.
      expect(storage.get(key)).toBe(undefined);

      // Set an item in the store.
      expect(storage.set(key, aSerializable)).toBe(undefined);
      expect(storage.get(key)).toBe(aSerializable);

      // Now remove it.
      expect(storage.remove(key)).toBe(undefined);
      expect(storage.get(key)).toBe(undefined);
    });

    it('returns null if null was set', function() {
      storage.set(key, null);
      expect(storage.get(key)).toBe(null);
    });
  });
});
