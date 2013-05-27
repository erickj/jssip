goog.provide('jssip.message.MessageContextSpec');

goog.require('goog.events.EventTarget');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.message.Message');
goog.require('jssip.message.MessageContext');
goog.require('jssip.message.MessageParserFactory');


describe('jssip.message.MessageContext', function() {
  var eventTarget;
  var parserRegistry;
  var requestText = 'INVITE sip:bob@biloxi.com SIP/2.0\r\n' +
    'Foo: request-foo\r\n' +
    '\r\n' +
    'request body';
  var responseText = 'SIP/2.0 200 OK\r\n' +
    'Foo: response-foo-1\r\n' +
    '\r\n' +
    'response body';
  var requestMessageContext;
  var responseMessageContext;

  beforeEach(function() {
    eventTarget = new goog.events.EventTarget();
    parserRegistry = new jssip.parser.ParserRegistry(
        new jssip.message.MessageParserFactory(eventTarget));
    requestMessageContext =
        new jssip.message.MessageContext(requestText, parserRegistry);
    responseMessageContext =
        new jssip.message.MessageContext(responseText, parserRegistry);
  });

  describe('raw message text', function() {
    it('should return raw message text', function() {
      expect(requestMessageContext.getRawMessageText()).toBe(requestText);
      expect(responseMessageContext.getRawMessageText()).toBe(responseText);
    });
  });

  describe('message', function() {
    it('should return a parsed message', function() {
      var message = requestMessageContext.getMessage();
      expect(message).toEqual(jasmine.any(jssip.message.Message));
    });

    it('should only parse a message once', function() {
      spyOn(parserRegistry, 'parseMessage').andCallThrough();
      var message = requestMessageContext.getMessage();
      expect(requestMessageContext.getMessage()).toBe(message);
      expect(parserRegistry.parseMessage.calls.length).toBe(1);
    });
  });
});
