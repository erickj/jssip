goog.provide('jssip.core.PropertyHolderSpec');

goog.require('goog.Disposable');
goog.require('jssip.core.PropertyHolder');

describe ('jssip.core.PropertyHolder', function() {
  var propertyHolder;
  var propertyMap;

  beforeEach(function() {
    propertyMap = {};
    propertyMap['foo'] = 'fooval';
    propertyMap['bar'] = 'barval';
    propertyMap['disp'] = new goog.Disposable();

    propertyHolder = new jssip.core.PropertyHolder(propertyMap);
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

  describe('#equals', function() {
    var equalPropertyHolder;
    var unequalPropertyHolder;

    beforeEach(function() {
      equalPropertyHolder = new jssip.core.PropertyHolder(propertyMap);
      unequalPropertyHolder = new jssip.core.PropertyHolder();
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

  describe('#dispose', function() {
    it('it should dispose of inner disposables', function() {
      expect(propertyHolder.isDisposed()).toBe(false);
      expect(propertyMap['disp'].isDisposed()).toBe(false);
      propertyHolder.dispose();
      expect(propertyHolder.isDisposed()).toBe(true);
      expect(propertyMap['disp'].isDisposed()).toBe(true);
    });
  });
});
