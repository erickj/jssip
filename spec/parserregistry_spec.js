goog.provide('jssip.ParserRegistrySpec');

goog.require('jssip.ParserRegistry');

describe('jssip.ParserRegistry', function() {
  var registry;

  describe('message parsers', function() {
    var messageParser;
    var stubMessageParserFactory;

    beforeEach(function() {
      messageParser = {};
      stubMessageParserFactory = {
        createParser: function(text) {
          messageParser.text = text;
          return messageParser;
        }
      }
      registry = new jssip.ParserRegistry(stubMessageParserFactory);
    });

    it('should create message parser instances from the message parser factory',
       function() {
         expect(registry.createMessageParser('xyz')).toBe(messageParser);
         expect(messageParser.text).toBe('xyz');
       });
  });
});
