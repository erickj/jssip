goog.provide('jssip.message.MessageContextSpec');
goog.provide('jssip.message.MessageContextSpec.TestMessageContext');

goog.require('goog.testing.MockControl');
goog.require('jssip.message.HeaderImpl');
goog.require('jssip.message.MessageContext');
goog.require('jssip.sip.protocol.storage.DialogStorage');
goog.require('jssip.testing.SharedMessageContextSpec');
goog.require('jssip.testing.util.messageutil');
goog.require('jssip.testing.util.parseutil');


/**
 * @param {!jssip.message.Message} message
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @param {!jssip.sip.SipContext} sipContext
 * @constructor
 */
jssip.message.MessageContextSpec.TestMessageContext =
    function(message, parserRegistry, sipContext) {
  /** @type {!jssip.message.Message} */
  this.messageInternal = message;

  this.internalSpy = jasmine.createSpy();

  goog.base(this, /** @type {jssip.message.MessageContext.Type} */ ("test"),
      parserRegistry, sipContext);
};
goog.inherits(jssip.message.MessageContextSpec.TestMessageContext,
    jssip.message.MessageContext);


/** @override */
jssip.message.MessageContextSpec.TestMessageContext.prototype.
    getMessageInternal = function() {
  return this.messageInternal;
};


/** @override */
jssip.message.MessageContextSpec.TestMessageContext.prototype.
    setHeaderInternal = function(key, value, opt_overwrite) {
  this.internalSpy(key, value, opt_overwrite);
};


/** @override */
jssip.message.MessageContextSpec.TestMessageContext.prototype.
    setRequestUriInternal = function(requestUri) {
  this.internalSpy(requestUri);
};


describe('jssip.message.MessageContext', function() {
  var mockControl;
  var mockParserRegistry;

  var parserRegistry;
  var messageContext;
  var messageDummy;
  var sipContext;

  var factoryFn = function(opt_parserRegistry) {
    mockControl = new goog.testing.MockControl();
    mockParserRegistry =
        jssip.testing.util.parseutil.createMockParserRegistry(mockControl);

    parserRegistry = opt_parserRegistry || mockParserRegistry;
    sipContext = jssip.testing.util.messageutil.createSipContext();
    messageDummy = jssip.testing.util.messageutil.parseMessage(
        jssip.testing.util.messageutil.ExampleMessage.INVITE);
    return messageContext =
        new jssip.message.MessageContextSpec.TestMessageContext(
            messageDummy, parserRegistry, sipContext);
  };

  beforeEach(factoryFn);

  afterEach(function() {
    mockControl.$tearDown();
  });

  describe('#getMessage', function() {
    it('returns the result of #getMessageInternal', function() {
      expect(messageContext.getMessage()).toBe(messageDummy);
    });

    it('checks the #isDisposed status of the cached message', function() {
      var postDisposeMessage = /** @type {!jssip.message.Message} */ ({});
      var message = messageContext.getMessage();
      messageContext.messageInternal = postDisposeMessage;

      expect(messageContext.getMessage()).toBe(message);
      message.dispose();
      expect(messageContext.getMessage()).toBe(postDisposeMessage);
    });
  });

  describe('#isRequest', function() {
    it('returns true if the message is a request', function() {
      expect(messageContext.isRequest()).toBe(true);
    });

    it('returns false if the message is a response', function() {
      var responseMessage = jssip.testing.util.messageutil.parseMessage(
          jssip.testing.util.messageutil.ExampleMessage.INVITE_200_OK);
      var responseMessageContext =
          new jssip.message.MessageContextSpec.TestMessageContext(
              responseMessage, mockParserRegistry);
      expect(responseMessageContext.isRequest()).toBe(false);
    });
  });

  describe('#getDialog', function() {
    var mockDialogStorage;
    var dialog;

    beforeEach(function() {
      dialog = /** @type {!jssip.sip.protocol.Dialog} */ ({});
      mockDialogStorage = mockControl.createLooseMock(
          jssip.sip.protocol.storage.DialogStorage);
      sipContext.getDialogStorage = function() {
        return mockDialogStorage;
      }
    });

    it('returns a dialog when from dialog storage', function() {
      mockDialogStorage.getDialogForMessageContext(messageContext).
          $returns(dialog);

      mockControl.$replayAll();
      expect(messageContext.getDialog()).toBe(dialog);
      mockControl.$verifyAll();
    });
  });

  describe('#getParsedHeader', function() {
    var testHeader = 'Contact';
    var testHeaderValues;

    beforeEach(function() {
      testHeaderValues = messageDummy.getHeaderValue(testHeader);
    });

    it('parses headers from the parser registry', function() {
      var result = ['parse result of 0th header'];
      mockParserRegistry.parseHeader(testHeader, testHeaderValues[0]).
          $returns(result).$times(1);

      mockControl.$replayAll();
      expect(messageContext.getParsedHeader(testHeader)).toEqual([result]);
      // Call again to test the parser registry is called once.
      messageContext.getParsedHeader(testHeader);
      mockControl.$verifyAll();
    });

    it('gets parsed headers with no registered header parser', function() {
      messageContext =
          factoryFn(jssip.testing.util.parseutil.createParserRegistry());
      messageContext.messageInternal.getHeaderValue = function() {
        return ['flaptacious'];
      }

      var headers = messageContext.getParsedHeader('Fizzle-Bang');
      expect(headers[0]).toEqual(jasmine.any(jssip.message.HeaderImpl));
      expect(headers[0].getParsedValue()).toEqual(['flaptacious']);
    });
  });

  describe('cache clearing methods', function() {
    var cachedMessage;

    beforeEach(function() {
      cachedMessage = messageContext.getMessage();
    });

    describe('#setHeader', function() {
      it('calls the #setHeaderInternal implementation of the subclass',
         function() {
           var header = 'Foo';
           var value = 'foobar';
           var overwrite = false;

           expect(messageContext.internalSpy).not.toHaveBeenCalled();
           messageContext.setHeader(header, value, overwrite);
           expect(messageContext.internalSpy).
               toHaveBeenCalledWith(header, value, overwrite);
         });

      it('clears the cache', function() {
        expect(cachedMessage.isDisposed()).toBe(false);
        messageContext.setHeader('Foo', 'bar');
        expect(cachedMessage.isDisposed()).toBe(true);
      });
    });

    describe('#setRequestUri', function() {
      it('calls the #setRequestUriInternal implementation of the subclass',
         function() {
           expect(messageContext.internalSpy).not.toHaveBeenCalled();
           messageContext.setRequestUri('sip:minions@me.com');
           expect(messageContext.internalSpy).
               toHaveBeenCalledWith('sip:minions@me.com');
         });

      it('clears the cache', function() {
        expect(cachedMessage.isDisposed()).toBe(false);
        messageContext.setRequestUri('sip:minions@me.com');
        expect(cachedMessage.isDisposed()).toBe(true);
      });
    });
  });

  sharedMessageContextBehaviors(factoryFn);
});
