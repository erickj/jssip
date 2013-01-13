goog.provide('jssip.ParserSpec');

goog.require('jssip.Parser');

describe('SIP Parser', function() {
  it('should register header handlers', function() {
    var parser = new jssip.Parser();
  });

  describe('jssip.Parser.MessageParser_', function() {
    var message1;
    var message2;

    beforeEach(function() {
      message1 = "the rain in spain\r\nfalls mainly\r\non the plain";
      message2 = "the rain in spain\r\n";
    });

    it('it should read a line of text', function() {
      var messageParser = new jssip.Parser.MessageParser_(message1);
      expect(messageParser.readNextLine()).toBe("the rain in spain");
      expect(messageParser.readNextLine()).toBe("falls mainly");
      expect(messageParser.readNextLine()).toBe("on the plain");
      expect(messageParser.readNextLine()).toBe(null);
    });

    it('it should read the empty string if a line ends in CRLF', function() {
      var messageParser = new jssip.Parser.MessageParser_(message2);
      expect(messageParser.readNextLine()).toBe("the rain in spain");
      expect(messageParser.readNextLine()).toBe("");
      expect(messageParser.readNextLine()).toBe(null);
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
            return this.actual instanceof jssip.message.Request;
          },
          toBeResponse: function() {
            return this.actual instanceof jssip.message.Response;
          },
          toThrowParseError: function() {
            var result = false;
            try {
              this.actual();
            } catch(e) {
              result = e instanceof jssip.ParseError;
            }
            return result;
          }
        });
      });

      it('should parse a request from a request', function() {
        var parser = new jssip.Parser.MessageParser_(request);
        expect(parser.parse()).toBeRequest();
      });

      it('should parse a response from a response', function() {
        var parser = new jssip.Parser.MessageParser_(response);
        expect(parser.parse()).toBeResponse();
      });

      it('should throw a parse error if there is a CR or LF in the first line',
         function() {
           var parser = new jssip.Parser.MessageParser_("\n" + response);
           expect(function() { parser.parse(); }).toThrowParseError();

           parser = new jssip.Parser.MessageParser_("\r" + response);
           expect(function() { parser.parse(); }).toThrowParseError();
         });

      it('should throw a parse error if it is not a status line', function() {
        var parser = new jssip.Parser.MessageParser_("ladsjfl ldfkjaldf");
        expect(function() { parser.parse(); }).toThrowParseError();
      });

      it('should add headers to the message', function() {
        var parser = new jssip.Parser.MessageParser_(response);
        var message = parser.parse();
        expect(message.getRawHeaderValue('foo')).toEqual(
          ['response-foo-1', 'response-foo-2']);
      });

      it('should trim right ws from header names and left from values',
         function() {
           var messageText = "SIP/2.0 200 OK\r\n" +
             "Foo       :        response-foo\r\n" +
             "\r\n";

           var parser = new jssip.Parser.MessageParser_(messageText);
           var message = parser.parse();
           expect(message.getRawHeaderValue('foo')).toEqual(['response-foo']);
         });

      it('should add a parse warning on malformed headers and continue parsing',
         function() {
           var messageText = "SIP/2.0 200 OK\r\n" +
             "Foo\r\n" +
             "Bar: bar-value\r\n" +
             "\r\n";
           var parser = new jssip.Parser.MessageParser_(messageText);
           var message = parser.parse();
           expect(parser.parseWarnings.length).toBe(1);
           expect(message.getRawHeaderValue('bar')).toEqual(['bar-value']);
         });

      it('should handle multi-line headers', function() {
        var messageText = "SIP/2.0 200 OK\r\n" +
          "Foo: Hi this is crazy\nbut call me\nmaybe\r\n" +
          "Bar: bar-value\r\n" +
          "\r\n";
        var parser = new jssip.Parser.MessageParser_(messageText);
        var message = parser.parse();
        expect(message.getRawHeaderValue('foo')[0]).
          toBe('Hi this is crazy but call me maybe');
        expect(message.getRawHeaderValue('bar')[0]).toBe('bar-value');
      });

      it('should throw a parse error if there is no CRLF after headers',
         function() {
           var messageText = "SIP/2.0 200 OK\r\n" +
             "Foo: bar\r\n";
           var parser = new jssip.Parser.MessageParser_(messageText);
           expect(function() { debugger; parser.parse(); }).toThrowParseError();
         });
    });
  });
});
