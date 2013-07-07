goog.provide('jssip.message.MessageSpec');

goog.require('jssip.message.Message');
goog.require('jssip.message.Message.Builder');

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

  describe('#dispose', function() {
    it('is disposable', function() {
      var message = requestBuilder.build();
      expect(message.isDisposed()).toBe(false);

      message.dispose();
      expect(message.isDisposed()).toBe(true);
    });
  });
});
