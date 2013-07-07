goog.provide('jssip.parser.ParserRegistrySpec');

goog.require('goog.events.EventTarget');
goog.require('jssip.parser.ParseError');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.parser.NoRegisteredHeaderParserError');
goog.require('jssip.parser.NoRegisteredUriParserError');

describe('jssip.parser.ParserRegistry', function() {
  var registry;
  var parserFactory;
  var parser;
  var eventTarget;

  beforeEach(function() {
    eventTarget = new goog.events.EventTarget();
    parser = jasmine.createSpyObj('messageParser', ['parse', 'initializeHeaderName']);
    parser.parse.andReturn({});
    parserFactory = {
      createParser: jasmine.createSpy().andReturn(parser)
    }
    registry = new jssip.parser.ParserRegistry(parserFactory, eventTarget);
  });

  describe('invoking parsers', function() {
    describe('#parseMessage', function() {
      it('should create a new parser and call parse', function() {
        var messageText = 'im a message';
        registry.parseMessage(messageText);
        expect(parserFactory.createParser).toHaveBeenCalledWith(messageText);
        expect(parser.parse).toHaveBeenCalled();
      });
    });

    describe('#parseHeader', function() {
      it('should create a new parser and call parse', function() {
        var name = 'hdr';
        var value = 'val';
        registry.registerHeaderParserFactory(name, parserFactory);
        registry.parseHeader(name, value);
        expect(parserFactory.createParser).toHaveBeenCalledWith(value);
        expect(parser.initializeHeaderName).toHaveBeenCalledWith(name);
        expect(parser.parse).toHaveBeenCalled();
      });

      it('should throw an error for an unknown header type', function() {
        expect(function() {
          registry.parseHeader('hdr', 'val');
        }).toThrow(
            new jssip.parser.NoRegisteredHeaderParserError('hdr').message);
      });
    });

    describe('#parseUri', function() {
      it('should create a new parser and call parse', function() {
        var uri = 'scheme:val';
        registry.registerUriParserFactory('scheme', parserFactory);
        registry.parseUri(uri);
        expect(parserFactory.createParser).toHaveBeenCalledWith(uri);
        expect(parser.parse).toHaveBeenCalled();
      });

      it('should throw an error for an unknown URI scheme', function() {
        expect(function() {
          registry.parseUri('scheme-x:uri');
        }).toThrow(
            new jssip.parser.NoRegisteredUriParserError('scheme-x').message);
      });

      it('should throw an error for a missing scheme', function() {
        expect(function() {
          registry.parseUri('uri');
        }).toThrow();
      });
    });

    describe('parsing with errors', function() {
      it('should dispatch events for thrown ParseErrors', function() {
        var handlerInvoked = false;
        parser.parse.andCallFake(function() {
          throw new jssip.parser.ParseError('a fake message');
        });
        var handler = function(e) {
          handlerInvoked = true;
          expect(e.message).toBe('a fake message');
        };
        eventTarget.addEventListener(
            jssip.parser.Parser.EventType.ERROR, handler);
        expect(function() {
          registry.parseMessage('foo');
        }).toThrow();
        expect(handlerInvoked).toBe(true);
      });
    });
  });

  describe('#registerUriParserFactory', function() {
    var uriParserFactory;
    var scheme;
    beforeEach(function() {
      scheme = 'ponzi';
      uriParserFactory = {};
    });

    it('should register a URI parser to a scheme', function() {
      expect(registry.registerUriParserFactory(scheme, uriParserFactory)).
          toBe(true);
      // registering for the same scheme should be false
      expect(registry.registerUriParserFactory(scheme, uriParserFactory)).
          toBe(false);
    });

    it('should throw if finalized', function() {
      registry.finalize();
      expect(function() {
        registry.registerUriParserFactory(scheme, uriParserFactory);
      }).toThrow();
    });
  });

  describe('#registerHeaderParserFactory', function() {
    var headerParserFactory;
    var scheme;
    beforeEach(function() {
      scheme = 'ponzi';
      headerParserFactory = {};
    });

    it('should register a header parser to a scheme', function() {
      expect(registry.registerHeaderParserFactory(scheme, headerParserFactory)).
          toBe(true);
      // registering for the same scheme should be false
      expect(registry.registerHeaderParserFactory(scheme, headerParserFactory)).
          toBe(false);
    });

    it('should throw if finalized', function() {
      registry.finalize();
      expect(function() {
        registry.registerHeaderParserFactory(scheme, headerParserFactory);
      }).toThrow();
    });
  });
});
