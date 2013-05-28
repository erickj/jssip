goog.provide('jssip.message.BuilderMessageContextSpec');

goog.require('jssip.message.BuilderMessageContext');
goog.require('jssip.message.Message.Builder');


describe('jssip.message.RawMessageContext', function() {
  var messageContext;
  var builder;
  var parserRegistry;

  beforeEach(function() {
    builder = new jssip.message.Message.Builder();
    builder.setMethod('FOO').
        setSipVersion('SIP/2.0').
        setRequestUri('sip:foo@bar.com').
        setHeaders(['name', 'value']);

    parserRegistry = /** @type {!jssip.parser.ParserRegistry} */ ({});
    messageContext =
        new jssip.message.BuilderMessageContext(builder, parserRegistry);
  });

  describe('#getBuilder', function() {
    it('should return the builder', function() {
      expect(messageContext.getBuilder()).toBe(builder);
    });
  });

  describe('#getMessage', function() {
    it('should return a built message', function() {
      var message = messageContext.getMessage();
      expect(message).toEqual(jasmine.any(jssip.message.Message));
    });

    it('should only parse a message once', function() {
      spyOn(builder, 'build').andCallThrough();
      var message = messageContext.getMessage();
      expect(messageContext.getMessage()).toBe(message);
      expect(builder.build.calls.length).toBe(1);
    });
  });
});
