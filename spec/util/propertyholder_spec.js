goog.provide('jssip.util.PropertyHolderSpec');

goog.require('goog.Disposable');
goog.require('jssip.util.PropertyHolder');

describe ('jssip.util.PropertyHolder', function() {
  var propertyHolder;
  var propertyMap;

  beforeEach(function() {
    propertyMap = {};
    propertyMap['foo'] = 'fooval';
    propertyMap['bar'] = 'barval';
    propertyMap['disp'] = new goog.Disposable();

    propertyHolder = new jssip.util.PropertyHolder(propertyMap);
  });

  describe('#get', function() {
    it('it should return a value for a registered key', function() {
      expect(propertyHolder.get('foo')).toBe(propertyMap['foo']);
      expect(propertyHolder.get('bar')).toBe(propertyMap['bar']);
    });

    it('it should return undefined for unregistered keys', function() {
      expect(propertyHolder.get('xyz')).toBe(undefined);
    });
  });

  describe('#set', function() {
    it('should throw an error on immutable property holders', function() {
      expect(function() {
        propertyHolder.set('never', 'gunna-see-this');
      }).toThrow();
    });

    it('should set a key-value pair on a mutable property holder', function() {
      var mutablePropertyHolder =
          new jssip.util.PropertyHolder({}, false /* opt_isImmutable */);
      mutablePropertyHolder.set('key', 'value');
      expect(mutablePropertyHolder.get('key')).toBe('value');
    });
  });

  describe('#equals', function() {
    var equalPropertyHolder;
    var unequalPropertyHolder;

    beforeEach(function() {
      equalPropertyHolder = new jssip.util.PropertyHolder(propertyMap);
      unequalPropertyHolder = new jssip.util.PropertyHolder();
    });

    it('should return true for identity comparison', function() {
      expect(propertyHolder.equals(propertyHolder)).toBe(true);
    });

    it('should return true symmetrically', function() {
      expect(propertyHolder.equals(equalPropertyHolder)).toBe(true);
      expect(equalPropertyHolder.equals(propertyHolder)).toBe(true);
    });

    it('should return false symmetrically', function() {
      expect(propertyHolder.equals(unequalPropertyHolder)).toBe(false);
      expect(unequalPropertyHolder.equals(propertyHolder)).toBe(false);
    });
  });
});
