goog.provide('jssip.AbstractParserSpec');

goog.require('jssip.AbstractParser');

describe('jssip.AbstractParser', function() {
  describe('string scanning', function() {
    var message1;
    var message2;

    beforeEach(function() {
      message1 = "the rain in spain\r\nfalls mainly\r\non the plain";
      message2 = "the rain in spain\r\n";
    });

    it('it should read a line of text', function() {
      var parser = new jssip.AbstractParser(message1);
      expect(parser.readNextLine()).toBe("the rain in spain");
      expect(parser.readNextLine()).toBe("falls mainly");
      expect(parser.readNextLine()).toBe("on the plain");
      expect(parser.readNextLine()).toBe(null);
    });

    it('it should read the empty string if a line ends in CRLF', function() {
      var parser = new jssip.AbstractParser(message2);
      expect(parser.readNextLine()).toBe("the rain in spain");
      expect(parser.readNextLine()).toBe("");
      expect(parser.readNextLine()).toBe(null);
    });
  });
});