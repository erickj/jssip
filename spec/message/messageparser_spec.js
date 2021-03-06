goog.provide('jssip.message.MessageParserSpec');

goog.require('jssip.message.MessageParser');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.parser.Parser');

describe('jssip.message.MessageParser', function() {
  describe('jssip.message.MessageParserFactory', function() {
    beforeEach(function() {
      this.addMatchers({
        toBeMessageParser: function() {
          return this.actual instanceof jssip.message.MessageParser;
        }
      })
    });

    it('should create a message parser', function() {
      var factory = new jssip.message.MessageParserFactory();
      var parser = factory.createParser('message');
      expect(parser).toBeMessageParser();
    });
  });

  describe('message parsing', function() {
    var request = "INVITE sip:bob@biloxi.com SIP/2.0\r\n" +
        "Foo: request-foo\r\n" +
        "Biz: request-biz\r\n" +
        "\r\n";

    var response = "SIP/2.0 200 OK\r\n" +
        "Foo: response-foo-1\r\n" +
        "Biz: response-biz\r\n" +
        "Foo: response-foo-2\r\n" +
        "\r\n";

    beforeEach(function() {
      this.addMatchers({
        toBeRequest: function() {
          return this.actual.isRequest();
        },
        toBeResponse: function() {
          return !this.actual.isRequest();
        },
        toThrowParseError: function() {
          var result = false;
          try {
            this.actual();
          } catch(e) {
            result = e instanceof jssip.parser.ParseError;
          }
          return result;
        }
      });
    });

    it('should parse a request from a request', function() {
      var parser = new jssip.message.MessageParser(request);
      expect(parser.parse()).toBeRequest();
    });

    it('should parse a response from a response', function() {
      var parser = new jssip.message.MessageParser(response);
      expect(parser.parse()).toBeResponse();
    });

    it('should throw a parse error if there is a CR or LF in the first line',
       function() {
         var parser = new jssip.message.MessageParser("\n" + response);
         expect(function() { parser.parse(); }).toThrowParseError();

         parser = new jssip.message.MessageParser("\r" + response);
         expect(function() { parser.parse(); }).toThrowParseError();
       });

    it('should throw a parse error if it is not a status line', function() {
      var parser = new jssip.message.MessageParser("ladsjfl ldfkjaldf");
      expect(function() { parser.parse(); }).toThrowParseError();
    });

    it('should add headers to the message', function() {
      var parser = new jssip.message.MessageParser(response);
      var message = parser.parse();
      expect(message.getHeaderValue('foo')).toEqual(
        ['response-foo-1', 'response-foo-2']);
    });

    it('should trim right ws from header names and left from values',
       function() {
         var messageText = "SIP/2.0 200 OK\r\n" +
           "Foo       :        response-foo\r\n" +
           "\r\n";
         var parser = new jssip.message.MessageParser(messageText);
         var message = parser.parse();
         expect(message.getHeaderValue('foo')).toEqual(['response-foo']);
       });

    it('should dispatch a parse warning on malformed headers and continue parsing',
       function() {
         var messageText = "SIP/2.0 200 OK\r\n" +
             "Foo\r\n" +
             "Bar: bar-value\r\n" +
             "\r\n";
         var parser = new jssip.message.MessageParser(messageText);
         var handlerInvoked = false;
         var handler = function(e) {
           handlerInvoked = true;
           expect(e.type).toEqual(jssip.parser.Parser.EventType.WARNING);
           expect(e.value).toBe(messageText);
         };
         parser.addEventListener(jssip.parser.Parser.EventType.WARNING, handler);
         var message = parser.parse();
         expect(message.getHeaderValue('bar')).toEqual(['bar-value']);
         expect(handlerInvoked).toBe(true);
       });

    it('should handle multi-line headers', function() {
      var messageText = "SIP/2.0 200 OK\r\n" +
          "Foo: Hi this is crazy\nbut call me\nmaybe\r\n" +
          "Bar: bar-value\r\n" +
          "\r\n";
      var parser = new jssip.message.MessageParser(messageText);
      var message = parser.parse();
      expect(message.getHeaderValue('foo')[0]).
        toBe('Hi this is crazy but call me maybe');
      expect(message.getHeaderValue('bar')[0]).toBe('bar-value');
    });

    it('should throw a parse error if there is no CRLF after headers',
       function() {
         var messageText = "SIP/2.0 200 OK\r\n" +
             "Foo: bar\r\n";
         var parser = new jssip.message.MessageParser(messageText);
         expect(function() { parser.parse(); }).toThrowParseError();
       });

    it('should set the message body if there is one', function() {
      var messageText = "SIP/2.0 200 OK\r\n" +
          "Foo: foo-value\r\n" +
          "\r\n" +
          "Let the body begin!";
      var parser = new jssip.message.MessageParser(messageText);
      var message = parser.parse();
      expect(message.getBody()).toBe('Let the body begin!');
    });
  });
});
