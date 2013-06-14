goog.provide('jssip.sip.plugin.core.SipUriParserSpec');

goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');
goog.require('jssip.sip.plugin.core.SipUriParser');
goog.require('jssip.sip.plugin.core.SipUriParserFactory');

describe('jssip.sip.plugin.core.SipUriParser', function() {
  var sipUriParser;
  var sipUriParserFactory;

  beforeEach(function() {
    sipUriParserFactory = new jssip.sip.plugin.core.SipUriParserFactory();
  });

  describe('jssip.sip.plugin.core.SipUriParserFactory#create', function() {
    it('should create a SipUriParser', function() {
      var parser = sipUriParserFactory.createParser('');
      expect(parser instanceof jssip.sip.plugin.core.SipUriParser).toBe(true);
    });
  });

  describe('#parseParameters', function() {
    var parameterString = 'abc=def;transport=udp;truthy';
    var parser;

    beforeEach(function() {
      parser = sipUriParserFactory.createParser('');
    });

    it('should parse parameters without leading semicolon', function() {
      var result = parser.parseParameters(parameterString);
      expect(result).toEqual({
        abc: 'def',
        transport: 'udp',
        truthy: true
      });
    });

    it('should parse parameters with a leading semicolon', function() {
      var result = parser.parseParameters(';x=y');
      expect(result).toEqual({x:'y'});
    });
  });

  describe('#parse', function() {
    var makeUriBuilder = function() {
      return new jssip.uri.Uri.Builder();
    };

    // TODO(erick): This was copied to uri_spec, find a better way to
    // share test data.
    // Example SIP URIs, {@see http://tools.ietf.org/html/rfc3261#section-19.1.3}
    var expectedUriMap = {
      'sip:alice@atlanta.com': makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'alice').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'atlanta.com').
          build(),
      'sip:alice:secretword@atlanta.com;transport=tcp': makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'alice').
          addPropertyPair(jssip.uri.Uri.PropertyName.PASSWORD, 'secretword').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'atlanta.com').
          addPropertyPair(
              jssip.uri.Uri.PropertyName.PARAMETERS, 'transport=tcp').
          build(),
      'sips:alice@atlanta.com?subject=project%20x&priority=urgent':
          makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'alice').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'atlanta.com').
          addPropertyPair(jssip.uri.Uri.PropertyName.HEADERS,
              'subject=project%20x&priority=urgent').
          build(),
      'sip:+1-212-555-1212:1234@gateway.com;user=phone': makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, '+1-212-555-1212').
          addPropertyPair(jssip.uri.Uri.PropertyName.PASSWORD, '1234').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'gateway.com').
          addPropertyPair(
              jssip.uri.Uri.PropertyName.PARAMETERS, 'user=phone').
          build(),
      'sips:1212@gateway.com': makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, '1212').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'gateway.com').
          build(),
      'sip:alice@192.0.2.4': makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'alice').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, '192.0.2.4').
          build(),
      'sip:atlanta.com;method=REGISTER?to=alice%40atlanta.com':
          makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'atlanta.com').
          addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS,
              'method=REGISTER').
          addPropertyPair(
              jssip.uri.Uri.PropertyName.HEADERS, 'to=alice%40atlanta.com').
          build(),
      'sip:alice;day=tuesday@atlanta.com':
          makeUriBuilder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'alice;day=tuesday').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'atlanta.com').
          build()
    };

    it('should parse the URIs above as specified', function() {
      for (var rawUri in expectedUriMap) {
        sipUriParser = sipUriParserFactory.createParser(rawUri);
        var uri = sipUriParser.parse();
        expect(uri.equals(expectedUriMap[rawUri])).toBe(true, rawUri);
      }
    });

    it('should add a URI parser so the URI can parse parameters', function() {
      var rawUri = 'sip:alice@barcom;foo=bar';
      sipUriParser = sipUriParserFactory.createParser(rawUri);
      var uri = sipUriParser.parse();
      expect(uri.getParameter('foo')).toBe('bar');
    });
  });
});
