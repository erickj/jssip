goog.provide('jssip.uri.UriSpec');

goog.require('jssip.core.PropertyHolder');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.uri.Uri', function() {
  var uri;
  var uriBuilder;

  beforeEach(function() {
    uriBuilder = new jssip.uri.Uri.Builder();
    uriBuilder.
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'xyz').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com');

    uri = uriBuilder.build();
  });

  describe('#get', function() {
    it('should return the registered property values', function() {
      expect(uri.get(jssip.uri.Uri.PropertyName.SCHEME)).toEqual('xyz');
      expect(uri.get(jssip.uri.Uri.PropertyName.HOST)).toEqual('foo.com');
    });

    it('should return null for unset properties', function() {
      expect(uri.get(jssip.uri.Uri.PropertyName.USER)).toBe(null);
    });
  });

  describe('new', function(){
    it('should throw an error if scheme is not set', function() {
      expect(function() {
               (new jssip.uri.Uri.Builder()).build()
      }).toThrow();
    });

    it('should be a jssip.core.PropertyHolder', function() {
      expect(uri instanceof jssip.core.PropertyHolder).toBe(true);
    });
  });
});
