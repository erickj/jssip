goog.provide('jssip.message.MessageContextSpec');
goog.provide('jssip.message.MessageContextSpec.TestMessageContext');

goog.require('goog.testing.MockControl');
goog.require('jssip.message.MessageContext');
goog.require('jssip.testing.SharedMessageContextSpec');
goog.require('jssip.testing.util.messageutil');
goog.require('jssip.testing.util.parseutil');


/**
 * @param {!jssip.message.Messaeg} message
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 */
jssip.message.MessageContextSpec.TestMessageContext =
    function(message, parserRegistry) {
  /** @private {!jssip.message.Message} */
  this.messageInternal_ = message;
  var propertyMap = {};

  goog.base(this, /** @type {jssip.message.MessageContext.Type} */ ("test"),
      propertyMap, parserRegistry);
};
goog.inherits(jssip.message.MessageContextSpec.TestMessageContext,
    jssip.message.MessageContext);


/** @override */
jssip.message.MessageContextSpec.TestMessageContext.prototype.
    getMessageInternal = function() {
  return this.messageInternal_;
};


describe('jssip.message.MessageContext', function() {
  var mockControl;
  var mockParserRegistry;

  var messageContext;
  var messageDummy;

  var factoryFn = function() {
    mockControl = new goog.testing.MockControl();
    mockParserRegistry =
        jssip.testing.util.parseutil.createMockParserRegistry(mockControl);

    messageDummy = jssip.testing.util.messageutil.parseMessage(
        jssip.testing.util.messageutil.ExampleMessage.INVITE);
    return messageContext =
        new jssip.message.MessageContextSpec.TestMessageContext(
            messageDummy, mockParserRegistry);
  };

  beforeEach(factoryFn);

  afterEach(function() {
    mockControl.$tearDown();
  });

  describe('#getMessage', function() {
    it('should return the result of #getMessageInternal', function() {
      expect(messageContext.getMessage()).toBe(messageDummy);
    });
  });

  describe('#getParsedHeader', function() {
    var testHeader = 'Contact';
    var testHeaderValues;

    beforeEach(function() {
      testHeaderValues = messageDummy.getHeaderValue(testHeader);
    });

    it('should parse headers from the parser registry', function() {
      var result = ['parse result of 0th header'];
      mockParserRegistry.parseHeader(testHeader, testHeaderValues[0]).
          $returns(result).$times(1);

      mockControl.$replayAll();
      expect(messageContext.getParsedHeader(testHeader)).toEqual([result]);
      // Call again to test the parser registry is called once.
      messageContext.getParsedHeader(testHeader);
      mockControl.$verifyAll();
    });
  });

  sharedMessageContextBehaviors(factoryFn);
});
