goog.provide('jssip.message.HeaderImplSpec');

goog.require('jssip.util.PropertyHolder');
goog.require('jssip.message.HeaderImpl');

describe('jssip.message.HeaderImpl', function() {
  var header;

  beforeEach(function() {
    header = new jssip.message.HeaderImpl('foo', 'a value', ['a value']);
  });

  describe('getters', function() {
    it('#getHeaderName', function() {
      expect(header.getHeaderName()).toBe('foo');
    });

    it('#getRawValue', function() {
      expect(header.getRawValue()).toBe('a value');
    });

    it('#getParsedValue', function() {
      expect(header.getParsedValue()).toEqual(['a value']);
    });
  });
});
