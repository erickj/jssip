goog.provide('jssip.util.ScannerSpec');

goog.require('jssip.util.Scanner');

describe('jssip.util.Scanner', function() {
  describe('string scanning', function() {
    it('should return the next token position', function() {
      var str = "the rain in spain\r\nfalls mainly on the\r\nplane";
      var scanner = new jssip.util.Scanner(str);

      // first position, 17
      expect(scanner.nextTokenPosition(jssip.util.Scanner.TOKEN.CRLF)).toBe(17);
      expect(scanner.getPosition()).toBe(17 + jssip.util.Scanner.TOKEN.CRLF.length);

      // second position, 38
      expect(scanner.nextTokenPosition(jssip.util.Scanner.TOKEN.CRLF)).toBe(38);
      expect(scanner.getPosition()).toBe(38 + jssip.util.Scanner.TOKEN.CRLF.length);

      // there is no third token, -1
      expect(scanner.nextTokenPosition(jssip.util.Scanner.TOKEN.CRLF)).toBe(-1);
      expect(scanner.getPosition()).toBe(-1);
    });

    it('should throw an error if there is nothing left to scan', function() {
      var scanner = new jssip.util.Scanner('foobar');
      scanner.nextTokenPosition(['z']);
      expect(function() { scanner.nextTokenPosition(['z']) }).toThrow();
    });

    it('can take an array of chars as a token', function() {
      var str = "foobar";
      var scanner = new jssip.util.Scanner(str);

      expect(scanner.nextTokenPosition(['o','b'])).toBe(2);
    });

    it('should return substrings of message text', function() {
      var scanner = new jssip.util.Scanner('foobar');
      expect(scanner.getSubstring(2,4)).toBe('ob');

      expect(scanner.getSubstring(2,20)).toBe('obar');
    });

    it('should throw an error if substring start is greater than end',
       function() {
         var scanner = new jssip.util.Scanner('foobar');
         expect(function() { scanner.getSubstring(4,2) }).toThrow();
       });

    it('should return true from isEof when the whole string is scanned',
       function() {
         var scanner = new jssip.util.Scanner('foobar');
         expect(scanner.isEof()).toBe(false);
         scanner.nextTokenPosition(['z']);
         expect(scanner.isEof()).toBe(true);
       });
  });
});