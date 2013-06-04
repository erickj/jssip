goog.provide('jssip.message.HeaderSpec');

goog.require('jssip.util.PropertyHolder');
goog.require('jssip.message.Header');
goog.require('jssip.message.Header.Builder');

describe('SIP Message Header', function() {
  var header;
  var headerBuilder;

  beforeEach(function() {
    headerBuilder = new jssip.message.Header.Builder();
    headerBuilder.
        addPropertyPair(jssip.message.Header.PropertyName.NAME, 'foo').
        addPropertyPair(jssip.message.Header.PropertyName.RAW_VALUE, 'a value').
        addPropertyPair('randomproperty', 'randomvalue');
    header = headerBuilder.build();
  });

  describe('new', function() {
    it('should throw an error if NAME is not set', function() {
      expect(function() {
        (new jssip.message.Header.Builder()).build();
      });
    });

    it('should be a jssip.util.PropertyHolder', function() {
      expect(header instanceof jssip.util.PropertyHolder).toBe(true);
    });
  });

  describe('well known properties', function() {
    it('should have a name and raw value', function() {
      expect(header.get(jssip.message.Header.PropertyName.NAME)).toBe('foo');
      expect(header.get(jssip.message.Header.PropertyName.RAW_VALUE)).toBe('a value');
    });
  });
});
