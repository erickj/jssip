goog.provide('jssip.message.BuilderMessageContextSpec');

goog.require('jssip.message.BuilderMessageContext');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.testing.SharedMessageContextSpec');
goog.require('jssip.testing.util.messageutil');

describe('jssip.message.BuilderMessageContext', function() {
  var messageContext;
  var builder;
  var parserRegistry;
  var factoryFn = function() {
    builder = new jssip.message.Message.Builder();
    builder.setMethod('FOO').
        setSipVersion('SIP/2.0').
        setRequestUri('sip:foo@bar.com').
        setHeader('name', 'value');

    parserRegistry = /** @type {!jssip.parser.ParserRegistry} */ ({});
    return messageContext = new jssip.message.BuilderMessageContext(
        builder, true /* isStrictRouting */, parserRegistry,
        jssip.testing.util.messageutil.createSipContext());
  };

  beforeEach(factoryFn);

  describe('#getMessage', function() {
    it('returns a built message', function() {
      var message = messageContext.getMessage();
      expect(message).toEqual(jasmine.any(jssip.message.Message));
    });

    it('only parses a message once', function() {
      spyOn(builder, 'build').andCallThrough();
      var message = messageContext.getMessage();
      expect(messageContext.getMessage()).toBe(message);
      expect(builder.build.calls.length).toBe(1);
    });
  });

  describe('#isLocal', function() {
    it('returns true', function() {
      expect(messageContext.isLocal()).toBe(true);
    });
  });

  describe('#isStrictRouting', function() {
    it('returns the value passed in the constructor', function() {
      expect(messageContext.isStrictRouting()).toBe(true);
    });
  });

  describe('#setHeaderInternal', function() {
    it('sets a header on the builder', function() {
      var message = messageContext.getMessage();
      expect(message.getHeaderValue('FoozBallz')).toBe(null);

      messageContext.setHeader('FoozBallz', 'zllaBzooF');
      message = messageContext.getMessage();
      expect(message.getHeaderValue('FoozBallz')).toEqual(['zllaBzooF']);
    });
  });

  describe('#setRequestUriInternal', function() {
    it('sets a request uri on the builder', function() {
      var message = messageContext.getMessage();
      expect(message.getRequestUri()).toBe('sip:foo@bar.com');

      messageContext.setRequestUri('sips:bar@foo.org');
      message = messageContext.getMessage();
      expect(message.getRequestUri()).toBe('sips:bar@foo.org');
    });
  });

  sharedMessageContextBehaviors(factoryFn);
});
