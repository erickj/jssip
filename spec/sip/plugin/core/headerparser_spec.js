goog.provide('jssip.sip.plugin.core.HeaderParserSpec');

goog.require('jssip.event.EventBus');
goog.require('jssip.sip.plugin.core.HeaderParser');
goog.require('jssip.sip.plugin.core.HeaderParserFactoryImpl');
goog.require('jssip.sip.protocol.rfc3261');

describe('jssip.sip.plugin.core.HeaderParser', function() {
  var fromHeaderParser;
  var fromHeaderName = 'From';
  var fromHeaderValue = '"Erick" <sip:erick@ejjohnson.org>;tag=fd0db81c';

  var createParser = function(value) {
    var eventBus = new jssip.event.EventBus();
    var factory = new jssip.sip.plugin.core.HeaderParserFactoryImpl(eventBus);
    return factory.createParser(value);
  };

  beforeEach(function() {
    fromHeaderParser = createParser(fromHeaderValue);
    fromHeaderParser.initializeHeaderName(fromHeaderName);
  });

  describe('basic parsing', function() {
    it('should create a new header', function() {
      var header = fromHeaderParser.parse();
      expect(header.getHeaderName()).toBe('From');
      expect(header.getRawValue()).toBe(fromHeaderValue);
      expect(header.getParsedValue()).toEqual(jasmine.any(Array));
    });
  });

  describe('header name normalization', function() {
    var headers = ['Call-ID', 'call-id', 'Call-Id', 'i'];
    var callIdValue = '123abc';
    var parsers;

    beforeEach(function() {
      parsers = [];
      for (var i = 0; i < headers.length; i++) {
        parsers.push(createParser(callIdValue));
        parsers[i].initializeHeaderName(headers[i]);
      }
    });

    it('should parse non-normal header property names identically', function() {
      for (var i = 0; i < parsers.length; i++) {
        var result = parsers[i].parse();
        expect(result.getHeaderName()).toBe(
            jssip.sip.protocol.rfc3261.HeaderType.CALL_ID);
        expect(result.getRawValue()).toBe(callIdValue);
        expect(result.getParsedValue()).toEqual([callIdValue, '']);
      }
      expect(i).toBe(headers.length);
    });
  });
});
