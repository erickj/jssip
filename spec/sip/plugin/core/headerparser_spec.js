goog.provide('jssip.sip.plugin.core.HeaderParserSpec');

goog.require('jssip.message.Header');
goog.require('jssip.sip.plugin.core.HeaderParser');

describe('jssip.sip.plugin.core.HeaderParser', function() {
  var fromHeaderParser;
  var fromHeaderName = 'From';
  var fromHeaderValue = '"Erick" <sip:erick@ejjohnson.org>;tag=fd0db81c';
  var headerPropName = jssip.message.Header.PropertyName;

  beforeEach(function() {
    fromHeaderParser = new jssip.sip.plugin.core.HeaderParser(
        fromHeaderValue);
    fromHeaderParser.initializeHeaderName(fromHeaderName);
  });

  it('should create a new header', function() {
    var header = fromHeaderParser.parse();
    expect(header).toEqual(jasmine.any(jssip.message.Header));
    expect(header.get(headerPropName.NAME)).toBe('From');
    expect(header.get(headerPropName.RAW_VALUE)).toBe(fromHeaderValue);
    expect(header.get(headerPropName.PARSED_VALUE)).toEqual(
        jasmine.any(Array));
  });
});
