goog.provide('jssip.AbstractParserSpec');

goog.require('jssip.AbstractParser');

describe('jssip.AbstractParser', function() {
  describe('getters', function() {
    var parser;
    var message = 'bananas\r\nare\r\ndelicious'

    beforeEach(function() {
      parser = new jssip.AbstractParser(message);
    });

    it('should provide the current position', function() {
      expect(parser.getPosition()).toBe(0);
      parser.readNextLine();
      expect(parser.getPosition()).toBe(9);
    });

    it('should provide the raw text', function() {
      expect(parser.getRawText()).toBe(message);
    });
  });

  describe('string scanning', function() {
    var message1;
    var message2;

    beforeEach(function() {
      message1 = "the rain in spain\r\nfalls mainly\r\non the plain";
      message2 = "the rain in spain\r\n";
    });

    it('should read a line of text', function() {
      var parser = new jssip.AbstractParser(message1);
      expect(parser.readNextLine()).toBe("the rain in spain");
      expect(parser.readNextLine()).toBe("falls mainly");
      expect(parser.readNextLine()).toBe("on the plain");
      expect(parser.readNextLine()).toBe(null);
    });

    it('should read the empty string if a line ends in CRLF', function() {
      var parser = new jssip.AbstractParser(message2);
      expect(parser.readNextLine()).toBe("the rain in spain");
      expect(parser.readNextLine()).toBe("");
      expect(parser.readNextLine()).toBe(null);
    });

    it('should indicate when scanning has passed the end of text', function() {
      var parser = new jssip.AbstractParser('message');
      expect(parser.isEof()).toBe(false);
      // this will result in eof true because there is no trailing CRLF
      parser.readNextLine();
      expect(parser.isEof()).toBe(true);
    });

    it('should read a substring from the text' , function() {
      var parser = new jssip.AbstractParser(message1);
      expect(parser.readSubstring(0, 3)).toBe('the');
      expect(parser.readSubstring(0)).toBe(message1);
    });
  });
});