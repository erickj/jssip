goog.provide('jssip.sip.protocol.NameAddrSpec');

goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');

describe('jssip.sip.protocol.NameAddr', function() {
  var nameAddr;
  var nameAddrNoOptionals;
  var uri;
  var displayName;
  var contextParams;

  beforeEach(function() {
    uri = /** @type {!jssip.uri.Uri} */ ({});
    displayName = 'Liger'
    contextParams = /** @type {!jssip.sip.protocol.ParsedParams} */ ({});

    nameAddr = new jssip.sip.protocol.NameAddr(uri, displayName, contextParams);
    nameAddrNoOptionals = new jssip.sip.protocol.NameAddr(uri);
  });

  describe('getters', function() {
    describe('#getUri', function() {
      it('should return the uri', function() {
        expect(nameAddr.getUri()).toBe(uri);
      });
    });

    describe('#getDisplayName', function() {
      it('should return the provided display name', function() {
        expect(nameAddr.getDisplayName()).toBe(displayName);
      });

      it('should be the empty string when not provided', function() {
        expect(nameAddrNoOptionals.getDisplayName()).toBe('');
      });
    });

    describe('#getContextParams', function() {
      it('should return the provided context params', function() {
        expect(nameAddr.getContextParams()).toBe(contextParams);
      });

      it('should be an empty set of parsed params', function() {
        expect(nameAddrNoOptionals.getContextParams()).
            toEqual(jasmine.any(jssip.sip.protocol.ParsedParams));
      });
    });
  });
});
