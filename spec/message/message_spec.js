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
  var headers = ['foo','foo-value'];

  beforeEach(function() {
    requestBuilder = new jssip.message.Message.Builder();
    requestBuilder.setMethod(method).
      setSipVersion(version).
      setRequestUri(uri).
      setBody(body).
      setHeaders(headers);

    responseBuilder = new jssip.message.Message.Builder();
    responseBuilder.setSipVersion(version).
      setStatusCode(statusCode).
      setReasonPhrase(reason).
      setBody(body).
      setHeaders(headers);
  });

  describe('jssip.message.Message.Builder', function() {
    it('should create a request message when request values are set',
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

    it('should create a response message when response values are set',
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

    it('should throw when setting response and request values', function() {
      expect(function() { responseBuilder.setMethod(method); }).toThrow();
      expect(function() { responseBuilder.setRequestUri(uri); }).toThrow();

      expect(function() {
        requestBuilder.setStatusCode(statusCode);
      }).toThrow();
      expect(function() {
        requestBuilder.setReasonPhrase(reason);
      }).toThrow();
    });

    it('should throw when building an incomplete request', function() {
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

    it('should throw when building an incomplete response', function() {
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

    describe('building headers', function() {
      beforeEach(function() {
        requestBuilder = new jssip.message.Message.Builder();
        requestBuilder.setMethod(method).
          setSipVersion(version).
          setRequestUri(uri).
          setBody(body);
      });

      describe('#setHeaders', function() {
        it('should throw if used after #setHeader', function() {
          requestBuilder.setHeader('foo', 'bar');
          expect(function() {
            requestBuilder.setHeaders(['fiz', 'buz']);
          }).toThrow();
        });
      });

      describe('#setHeader', function() {
        it('should set name value pairs for header values', function() {
          var message = requestBuilder.
              setHeader('bloop', 'foo').
              setHeader('bloop', 'bar').
              setHeader('floop', 'flop').
              setHeader('gloop', ['hop', 'on', 'pop']).
              build();
          expect(message.getHeaderValue('bloop')).toEqual(['foo', 'bar']);
          expect(message.getHeaderValue('floop')).toEqual(['flop']);
          expect(message.getHeaderValue('gloop')).toEqual(['hop', 'on', 'pop']);
        });

        it('should overwrite header values when explicitly set', function() {
          var message = requestBuilder.
              setHeader('bloop', 'foo').
              setHeader('bloop', 'foo2', true /* opt_overwrite */).
              build();
          expect(message.getHeaderValue('bloop')).toEqual(['foo2']);
        });

        it('should throw if used after #setHeaders', function() {
          requestBuilder.setHeaders(['fiz', 'buz']);
          expect(function() {
            requestBuilder.setHeader('foo', 'bar');
          }).toThrow();
        });
      });
    });
  });

  describe('Headers', function() {
    var message;

    it('should add/return raw headers', function() {
      requestBuilder.setHeaders(['foo', 'bar']);
      message = requestBuilder.build();
      expect(message.getHeaderValue('foo')).toEqual(['bar']);
    });

    it('should accept multiple values for the same header', function() {
      requestBuilder.setHeaders(['foo', 'baz', 'foo', 'bar']);
      message = requestBuilder.build();
      expect(message.getHeaderValue('foo')).toEqual(['baz', 'bar']);
    });

    it('should return null for headers that do not exist', function() {
      requestBuilder.setHeaders([]);
      message = requestBuilder.build();
      expect(message.getHeaderValue('foo')).toBe(null);
    });

    it('should look for headers case insensitively', function() {
      requestBuilder.setHeaders(['foo', 'bar', 'FOO', 'baz']);
      message = requestBuilder.build();
      expect(message.getHeaderValue('Foo')).toEqual(['bar', 'baz']);
    });

    it('should normalize multiline values', function() {
      requestBuilder.setHeaders(
          ['foo', 'this value\n \t  spans across\nmultiple lines']);
      message = requestBuilder.build();
      expect(message.getHeaderValue('foo')[0]).
        toBe('this value spans across multiple lines');
    });
  });
});
