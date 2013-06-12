goog.provide('jssip.uri.UriSpec');

goog.require('jssip.util.PropertyHolder');
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

    it('should return \'\' for unset properties', function() {
      expect(uri.get(jssip.uri.Uri.PropertyName.USER)).toBe('');
    });
  });

  describe('syntax sugar', function() {
    it('#getHost should get the host', function() {
      expect(uri.getHost()).toEqual('foo.com');
    });

    it('#getScheme should get the scheme', function() {
      expect(uri.getScheme()).toEqual('xyz');
    });

    it('#isSecure should return true for SIPS URIs', function() {
      expect(uri.isSecure()).toBe(false);

      var secureUri = new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com').build();
      expect(secureUri.isSecure()).toBe(true);
    });

    it('#getPort should get the port', function() {
      expect(isNaN(uri.getPort())).toBe(true);

      var portUri = new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
        addPropertyPair(jssip.uri.Uri.PropertyName.PORT, 9999).
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com').build();
      expect(portUri.getPort()).toBe(9999);
    });
  });

  describe('parameters', function() {
    var paramString;
    var parsedParameters;
    var uriParser;
    var uriWithParamParser;

    beforeEach(function() {
      parsedParameters = {falsy: false, truthy: true, str: 'a string'};

      uriParser = /** @type {!jssip.uri.UriParser} */ ({});
      goog.mixin(uriParser, {
        parseParameters: jasmine.createSpy()
      });
      uriParser.parseParameters.andReturn(parsedParameters);

      paramString = 'xyz';
      uriWithParamParser =  new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com').
        addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS, paramString).
        addUriParser(uriParser).build();
    });

    describe('#getParameters', function() {
      it('should throw an error if there is no parser', function() {
        expect(function() {
          uri.getParameters();
        }).toThrow();
      });

      it('should return the parsed parameters in a URI if set', function() {
        var result = uriWithParamParser.getParameters();
        expect(uriParser.parseParameters).toHaveBeenCalledWith(paramString);
        expect(result).toBe(parsedParameters);
      });

      it('should return an empty object if there are no parameters', function() {
        var uriWithoutParams =  new jssip.uri.Uri.Builder().
            addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sips').
            addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com').
            addUriParser(uriParser).build();
        expect(uriWithoutParams.getParameters()).toEqual({});
        expect(uriParser.parseParameters).not.toHaveBeenCalled();
      });

      it('should only call in to UriParser#parseParameters once', function() {
        var result = uriWithParamParser.getParameters();
        expect(uriWithParamParser.getParameters()).toBe(result);
        expect(uriParser.parseParameters.calls.length).toBe(1);
      });
    });

    describe('#getParameter', function() {
      it('it should get the value of a parameter', function() {
        expect(uriWithParamParser.getParameter('falsy')).toBe(false);
        expect(uriWithParamParser.getParameter('truthy')).toBe(true);
        expect(uriWithParamParser.getParameter('str')).toBe('a string');
        expect(uriWithParamParser.getParameter('undef')).toBe(undefined);
      });
    });

    describe('##hasParameter', function() {
      it('should show a uri has a parameter', function() {
        expect(uriWithParamParser.hasParameter('falsy')).toBe(true);
        expect(uriWithParamParser.hasParameter('truthy')).toBe(true);
        expect(uriWithParamParser.hasParameter('str')).toBe(true);
        expect(uriWithParamParser.hasParameter('undef')).toBe(false);
      });
    });
  });

  describe('new', function(){
    it('should throw an error if scheme is not set', function() {
      var badBuilder = new jssip.uri.Uri.Builder();
      badBuilder.
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'foo.com');

      expect(function() {
        badBuilder.build()
      }).toThrow();
    });

    it('should throw an error if host is not set', function() {
      var badBuilder = new jssip.uri.Uri.Builder();
      badBuilder.
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip');

      expect(function() {
        badBuilder.build()
      }).toThrow();
    });

    it('should be a jssip.util.PropertyHolder', function() {
      expect(uri instanceof jssip.util.PropertyHolder).toBe(true);
    });
  });

  describe('#toString', function() {
    var makeUriBuilder = function() {
      return new jssip.uri.Uri.Builder();
    };

    // TODO(erick): This was copied from sipuriparser_spec, find a better way to
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

    it('should #toString to match the original', function() {
      for (var uriString in expectedUriMap) {
        var uri = expectedUriMap[uriString];
        expect(uri.toString()).toEqual(uriString);
      }
    });
  });
});
