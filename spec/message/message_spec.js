goog.provide('jssip.message.MessageSpec');

goog.require('jssip.message.Message');
//goog.require('jssip.message.Message.Builder');

describe("jssip.message.Message", function() {
  describe('Headers', function() {
    var message;

    beforeEach(function() {
      message = new jssip.message.Message();
    });

    it('should add/return raw headers', function() {
      message.addRawHeader('foo', 'bar');
      expect(message.getRawHeaderValue('foo')).toEqual(['bar']);
    });

    it('should accept multiple values for the same header', function() {
      message.addRawHeader('foo', 'baz');
      message.addRawHeader('foo', 'bar');
      expect(message.getRawHeaderValue('foo')).toEqual(['baz', 'bar']);
    });

    it('should return null for headers that do not exist', function() {
      expect(message.getRawHeaderValue('foo')).toBe(null);
    });

    it('should look for headers case insensitively', function() {
      message.addRawHeader('foo', 'bar');
      message.addRawHeader('FOO', 'baz');
      expect(message.getRawHeaderValue('Foo')).toEqual(['bar', 'baz']);
    });

    it('should normalize multiline values', function() {
      message.addRawHeader('foo', "this value\n \t  goes across\nmultiple lines");
      expect(message.getRawHeaderValue('foo')[0]).
        toBe('this value goes across multiple lines');
    });
  });
});