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
        "Foo: buz\r\n" +
        "Biz: fuz\r\n" +
        "\r\n";

      var response = "SIP/2.0 200 OK\r\n" +
        "Foo: bar\r\n" +
        "Biz: baz\r\n" +
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
        var messageParser = new jssip.Parser.MessageParser_(request);
        expect(messageParser.parse()).toBeRequest();
      });

      it('should parse a response from a response', function() {
        var messageParser = new jssip.Parser.MessageParser_(response);
        expect(messageParser.parse()).toBeResponse();
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
    });
  });
});
