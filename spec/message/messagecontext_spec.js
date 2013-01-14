goog.provide('jssip.message.MessageContextSpec');

goog.require('jssip.ParserRegistry');
goog.require('jssip.message.MessageContext');
goog.require('jssip.message.MessageParserFactory');


describe('jssip.message.MessageContext', function() {
  var context;
  var parserRegistry;
  var requestText = "INVITE sip:bob@biloxi.com SIP/2.0\r\n" +
    "Foo: request-foo\r\n" +
    "\r\n";
  var responseText = "SIP/2.0 200 OK\r\n" +
    "Foo: response-foo-1\r\n" +
    "\r\n";
  var createMessageContext;

  beforeEach(function() {
    this.addMatchers({
      toBeRequest: function() {
        return this.actual instanceof jssip.message.Request;
      },
      toBeResponse: function() {
        return this.actual instanceof jssip.message.Response;
      }
    });

    parserRegistry = new jssip.ParserRegistry(
        new jssip.message.MessageParserFactory());
    createMessageContext = function(text) {
      return new jssip.message.MessageContext(text, parserRegistry);
    }
  });

  // TODO(erick): error/warn event dispatch testing, initialization
  // testing, etc.

  describe('request parsing', function() {
    beforeEach(function() {
      context = createMessageContext(requestText);

    });

    it('should create a request message', function() {
      context.init();
      expect(context.isRequest()).toBe(true);
      expect(context.getRequest()).toBeRequest();
    });
  });

  describe('response parsing', function() {
    beforeEach(function() {
      context = createMessageContext(responseText);
    });

    it('should create a response message', function() {
      context.init();
      expect(context.isRequest()).toBe(false);
      expect(context.getResponse()).toBeResponse();
    });
  });
});