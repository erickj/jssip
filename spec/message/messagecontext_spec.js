goog.provide('jssip.message.MessageContextSpec');

goog.require('goog.events.EventHandler');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.message.MessageContext');
goog.require('jssip.message.MessageParserFactory');


describe('jssip.message.MessageContext', function() {
  var context;
  var eventHandler;
  var parserRegistry;
  var requestText = 'INVITE sip:bob@biloxi.com SIP/2.0\r\n' +
    'Foo: request-foo\r\n' +
    '\r\n' +
    'request body';
  var responseText = 'SIP/2.0 200 OK\r\n' +
    'Foo: response-foo-1\r\n' +
    '\r\n' +
    'response body';
  var createMessageContext;

  beforeEach(function() {
    eventHandler = new goog.events.EventHandler();
    parserRegistry = new jssip.parser.ParserRegistry(
        new jssip.message.MessageParserFactory());
    createMessageContext = function(text) {
      return new jssip.message.MessageContext(text, parserRegistry);
    }
  });

  afterEach(function() {
    eventHandler.dispose();
  });

  describe('request parsing', function() {
    beforeEach(function() {
      context = createMessageContext(requestText);
    });

    it('should create a request message', function() {
      context.init();
      expect(context.isRequest()).toBe(true);
    });
  });

  describe('response parsing', function() {
    beforeEach(function() {
      context = createMessageContext(responseText);
    });

    it('should create a response message', function() {
      context.init();
      expect(context.isRequest()).toBe(false);
    });
  });

  describe('parser invocation', function() {
    var messageWithErrors = 'WTF-IS-THIS?';
    var messageWithWarnings = 'SIP/2.0 200 OK\r\n' +
      'missing-colon-in-header\r\n' +
      'another-missing-colon-in-header\r\n' +
      'Foo: foo-value\r\n' +
      '\r\n' +
      'response body';
    var events = jssip.message.MessageContext.EVENT;
    var errorContext;
    var warningContext;

    beforeEach(function() {
      errorContext = createMessageContext(messageWithErrors);
      warningContext = createMessageContext(messageWithWarnings);
    });

    it('should rethrow errors that are NOT jssip.parser.ParseErrors', function() {
      var errorParserFactory = /** @type {!jssip.message.MessageParserFactory} */ ({
        createParser: function(text) {
          return /** @type {!jssip.message.MessageParser} */ ({
            parse: function() { throw new Error('BUSTED!'); }
          });
        }
      });
      var parserRegistry = new jssip.parser.ParserRegistry(errorParserFactory);
      var context = new jssip.message.MessageContext(
          requestText, parserRegistry);

      expect(function() { context.init(); }).toThrow('BUSTED!');
    });

    it('should dispatch parse-error events when there is an error',
       function() {
         var handlerFired = false;
         var handler = function(event) {
           handlerFired = true;
           expect(event.type).toBe(events.PARSE_ERROR);
           expect(event.start).toBe(0);
           expect(event.length).toBe(1);

           var parseError = errorContext.getParseErrors(0, 1)[0];
           expect(parseError instanceof jssip.parser.ParseError).toBe(true);
         };

         eventHandler.listen(errorContext, events.PARSE_ERROR, handler);
         errorContext.init();
         expect(handlerFired).toBe(true);

         // error context should be in a broken state, property access should fail
         expect(function() { errorContext.isRequest() }).toThrow();
       });

    it('should dispatch parse-warning events when there is are warnings',
       function() {
         var handlerFired = false;
         var handler = function(event) {
           handlerFired = true;
           expect(event.type).toBe(events.PARSE_WARNING);
           expect(event.start).toBe(0);
           expect(event.length).toBe(2);

           var parseWarnings = warningContext.getParseWarnings(0, 2);
           expect(parseWarnings.length).toBe(2);
         };

         eventHandler.listen(warningContext, events.PARSE_WARNING, handler);
         warningContext.init();
         expect(handlerFired).toBe(true);

         // the warning context should be in a functional state
         expect(warningContext.isRequest()).toBe(false);
       });
  });
});