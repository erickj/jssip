goog.provide('jssip.message.RawMessageContextSpec');

goog.require('goog.events.EventTarget');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.message.Message');
goog.require('jssip.message.RawMessageContext');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.testing.SharedMessageContextSpec');
goog.require('jssip.testing.util.messageutil');

describe('jssip.message.RawMessageContext', function() {
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
  var requestRawMessageContext;
  var responseRawMessageContext;
  var factoryFn = function() {
    eventTarget = new goog.events.EventTarget();
    parserRegistry = new jssip.parser.ParserRegistry(
        new jssip.message.MessageParserFactory(eventTarget), eventTarget);
    requestRawMessageContext = new jssip.message.RawMessageContext(
        requestText, parserRegistry,
        jssip.testing.util.messageutil.createSipContext());
    return responseRawMessageContext = new jssip.message.RawMessageContext(
        responseText, parserRegistry,
        jssip.testing.util.messageutil.createSipContext());
  };

  beforeEach(factoryFn);

  describe('raw message text', function() {
    it('should return raw message text', function() {
      expect(requestRawMessageContext.getRawMessageText()).toBe(requestText);
      expect(responseRawMessageContext.getRawMessageText()).toBe(responseText);
    });
  });

  describe('message', function() {
    it('should return a parsed message', function() {
      var message = requestRawMessageContext.getMessage();
      expect(message).toEqual(jasmine.any(jssip.message.Message));
    });

    it('should only parse a message once', function() {
      spyOn(parserRegistry, 'parseMessage').andCallThrough();
      var message = requestRawMessageContext.getMessage();
      expect(requestRawMessageContext.getMessage()).toBe(message);
      expect(parserRegistry.parseMessage.calls.length).toBe(1);
    });
  });

  sharedMessageContextBehaviors(factoryFn);
});
