goog.provide('jssip.message.MessageSpec');

goog.require('jssip.message.Message');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.testing.util.messageutil');

describe("jssip.message.Message", function() {
  var requestBuilder;
  var responseBuilder;

  var method = 'FOO';
  var version = 'SIP/2.0';
  var uri = 'foo@bar';
  var statusCode = '100';
  var reason = 'because';
  var body = 'a body of work';
  var headers = {foo: 'foo-value'};

  beforeEach(function() {
    requestBuilder = new jssip.message.Message.Builder();
    requestBuilder.setMethod(method).
        setSipVersion(version).
        setRequestUri(uri).
        setBody(body);

    responseBuilder = new jssip.message.Message.Builder();
    responseBuilder.setSipVersion(version).
        setStatusCode(statusCode).
        setReasonPhrase(reason).
        setBody(body);

    for (var header in headers) {
      requestBuilder.setHeader(header, headers[header]);
      responseBuilder.setHeader(header, headers[header]);
    };
  });

  describe('#equals', function() {
    var equalsMessage;

    beforeEach(function() {
      equalsMessage = responseBuilder.build();
    });

    it('returns true for a message is always equal to itself', function() {
      expect(equalsMessage.equals(equalsMessage)).toBe(true);
    });

    it('returns true for a message that is identical to itself', function() {
      expect(equalsMessage.equals(responseBuilder.build())).toBe(true);
    });

    it('returns false for a message that is dissimilar to itself', function() {
      responseBuilder.setHeader('not', 'equals');
      expect(equalsMessage.equals(responseBuilder.build())).toBe(false);
    });

    describe('semantic equivalence', function() {
      var builder1;
      var builder2;

      beforeEach(function() {
        builder1 = new jssip.message.Message.Builder();
        builder1.setMethod(method).
            setSipVersion(version).
            setRequestUri(uri).
            setBody(body);
        builder1.setHeader('bar', 'bar-val');
        builder1.setHeader('foo', 'foo-val');

        builder2 = new jssip.message.Message.Builder();
        builder2.setMethod(method).
            setSipVersion(version).
            setRequestUri(uri).
            setBody(body);
        builder2.setHeader('foo', 'foo-val');
        builder2.setHeader('bar', 'bar-val');
      });

      it('returns true for different order parameters with the same semantics',
         function() {
           expect(builder1.build().equals(builder2.build())).toBe(true);
           expect(builder2.build().equals(builder1.build())).toBe(true);
         });

      it('returns true if parameters for the same header maintain proper order',
         function() {
           builder1.setHeader('foo', 'foo-val2');
           builder1.setHeader('foo', 'foo-val3');
           builder2.setHeader('foo', ['foo-val2', 'foo-val3']);
           expect(builder1.build().equals(builder2.build())).toBe(true);
           expect(builder2.build().equals(builder1.build())).toBe(true);
         });

      it('returns false if parameters fail to maintain proper order',
         function() {
           builder1.setHeader('foo', 'foo-val3');
           builder1.setHeader('foo', 'foo-val2');
           builder2.setHeader('foo', ['foo-val2', 'foo-val3']);
           expect(builder1.build().equals(builder2.build())).toBe(false);
           expect(builder2.build().equals(builder1.build())).toBe(false);
         });

      it('returns false if parameters fail to maintain equivalent values',
         function() {
           builder1.setHeader('foo', 'foo-val-X');
           builder2.setHeader('foo', 'foo-val-Y');
           expect(builder1.build().equals(builder2.build())).toBe(false);
           expect(builder2.build().equals(builder1.build())).toBe(false);
         });
    });
  });

  describe('#stringify', function() {
    it('stringifies requests', function() {
      var expected = 'FOO foo@bar SIP/2.0\r\n' +
          'foo: foo-value\r\n' +
          '\r\n' + body;
      expect(requestBuilder.build().stringify()).toBe(expected);
    });

    it('stringifies responses', function() {
      var expected = 'SIP/2.0 100 because\r\n' +
          'foo: foo-value\r\n' +
          '\r\n' + body;
      expect(responseBuilder.build().stringify()).toBe(expected);
    });

    it('preserves semantic header order', function() {
      requestBuilder.setHeader('Route', 'Aruba');
      requestBuilder.setHeader('Route', 'Jamaica');
      requestBuilder.setHeader('Route', ['Bermuda', 'Bahama']);
      var expected = 'FOO foo@bar SIP/2.0\r\n' +
          'foo: foo-value\r\n' +
          'Route: Aruba\r\n' +
          'Route: Jamaica\r\n' +
          'Route: Bermuda\r\n' +
          'Route: Bahama\r\n' +
          '\r\n' + body;
      expect(requestBuilder.build().stringify()).toBe(expected);
    });

    describe('parsing reciprocity', function() {
      var Examples = jssip.testing.util.messageutil.ExampleMessage;
      for (var example in Examples) {
        it('parses and stringifies ' + example, function(example) {
          return function() {
            var rawMessage = Examples[example];
            var parsedExampleMessage =
                jssip.testing.util.messageutil.parseMessage(rawMessage);
            expect(parsedExampleMessage.stringify()).toBe(rawMessage);
          }
        }(example));
      };
    });
  });

  describe('#dispose', function() {
    it('is disposable', function() {
      var message = requestBuilder.build();
      expect(message.isDisposed()).toBe(false);

      message.dispose();
      expect(message.isDisposed()).toBe(true);
    });
  });

  describe('jssip.message.Message.Builder', function() {
    it('creates a request message when request values are set',
       function() {
         var message = requestBuilder.build();
         expect(message.isRequest()).toBe(true);
         expect(message.getMethod()).toBe(method);
         expect(message.getRequestUri()).toBe(uri);
         expect(message.getSipVersion()).toBe(version);
         expect(message.getStatusCode()).toBe('');
         expect(message.getReasonPhrase()).toBe('');
         expect(message.getHeaderValue('foo')).toEqual(['foo-value']);
       });

    it('creates a response message when response values are set',
       function() {
         var message = responseBuilder.build();
         expect(message.isRequest()).toBe(false);
         expect(message.getMethod()).toBe('');
         expect(message.getRequestUri()).toBe('');
         expect(message.getSipVersion()).toBe(version);
         expect(message.getStatusCode()).toBe(statusCode);
         expect(message.getReasonPhrase()).toBe(reason);
         expect(message.getHeaderValue('foo')).toEqual(['foo-value']);
       });

    it('throws when setting response and request values', function() {
      expect(function() { responseBuilder.setMethod(method); }).toThrow();
      expect(function() { responseBuilder.setRequestUri(uri); }).toThrow();

      expect(function() {
        requestBuilder.setStatusCode(statusCode);
      }).toThrow();
      expect(function() {
        requestBuilder.setReasonPhrase(reason);
      }).toThrow();
    });

    it('throws when building an incomplete request', function() {
      var builder = new jssip.message.Message.Builder();
      // throw because... missing SIP version
      expect(function() { builder.build(); }).toThrow();
      builder.setSipVersion(version);
      builder.setMethod(method);
      // ... missing URI
      expect(function() { builder.build(); }).toThrow();
      builder.setRequestUri(uri);
      builder.build();
    });

    it('throws when building an incomplete response', function() {
      var builder = new jssip.message.Message.Builder();
      // throw because... missing SIP version
      expect(function() { builder.build(); }).toThrow();
      builder.setSipVersion(version);
      // ... missing status code
      expect(function() { builder.build(); }).toThrow();
      builder.setStatusCode(statusCode);
      // dont throw because... don't need a reason phrase
      builder.build();
    });

    describe('#setHeader', function() {
      beforeEach(function() {
        requestBuilder = new jssip.message.Message.Builder();
        requestBuilder.setMethod(method).
            setSipVersion(version).
            setRequestUri(uri).
            setBody(body);
      });

      it('sets name value pairs for header values', function() {
        var message = requestBuilder.
            setHeader('bloop', 'foo').
            setHeader('floop', 'flop').
            setHeader('gloop', ['hop', 'on', 'pop']).
            build();
        expect(message.getHeaderValue('bloop')).toEqual(['foo']);
        expect(message.getHeaderValue('floop')).toEqual(['flop']);
        expect(message.getHeaderValue('gloop')).toEqual(['hop', 'on', 'pop']);
      });

      it('overwrites header values when explicitly set', function() {
        var message = requestBuilder.
            setHeader('bloop', 'foo').
            setHeader('bloop', 'foo2', true /* opt_overwrite */).
            build();
        expect(message.getHeaderValue('bloop')).toEqual(['foo2']);
      });

      it('accepts multiple values for the same header', function() {
        requestBuilder.setHeader('foo', 'baz');
        requestBuilder.setHeader('foo', 'bar');
        var message = requestBuilder.build();
        expect(message.getHeaderValue('foo')).toEqual(['baz', 'bar']);
      });

      it('returns null for headers that do not exist', function() {
        var message = requestBuilder.build();
        expect(message.getHeaderValue('foo')).toBe(null);
      });

      it('assigns headers case insensitively', function() {
        requestBuilder.setHeader('foo', 'bar');
        requestBuilder.setHeader('FOO', 'baz');
        var message = requestBuilder.build();
        expect(message.getHeaderValue('Foo')).toEqual(['bar', 'baz']);
      });

      it('normalizes multiline values', function() {
        requestBuilder.setHeader(
            'foo', 'this value\n \t  spans across\nmultiple lines');
        var message = requestBuilder.build();
        expect(message.getHeaderValue('foo')[0]).
            toBe('this value spans across multiple lines');
      });
    });
  });
});
