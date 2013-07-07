goog.provide('jssip.sip.protocol.NameAddrSpec');

goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.sip.protocol.NameAddr', function() {
  var nameAddr;
  var nameAddrNoOptionals;
  var uri;
  var displayName;
  var contextParams;

  beforeEach(function() {
    uri = new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
        addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'liger').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'not.a.tiger').
        build();
    displayName = 'Liger'
    contextParams =
        new jssip.sip.protocol.ParsedParams([[';', ['foo', '=', 'bar']]]);

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

  describe('#stringify', function() {
    describe('name-addrs', function() {
      it('stringifies name addrs', function() {
        expect(nameAddr.stringify()).toBe('"Liger" <sip:liger@not.a.tiger>;foo=bar');
      });

      it('stringifies name-addrs without display names', function() {
        uri = new jssip.uri.Uri.Builder().
            addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
            addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'liger').
            addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'not.a.tiger').
            addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS, 'fiz=buz').
            build();
        nameAddr = new jssip.sip.protocol.NameAddr(uri);

        expect(nameAddr.stringify()).toBe('<sip:liger@not.a.tiger;fiz=buz>');
      });
    })

    describe('addr-specs', function() {
      it('stringifies addr specs', function() {
        expect(nameAddrNoOptionals.stringify()).toBe('sip:liger@not.a.tiger');
      });
    });
  });
});
