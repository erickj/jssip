goog.provide('jssip.sip.protocol.header.ViaHeaderParserFactorySpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.message.HeaderImpl');
goog.require('jssip.sip.grammar.rfc3261');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.ViaParm');
goog.require('jssip.sip.protocol.header.ViaHeaderParserFactory');
goog.require('jssip.sip.protocol.header.ViaHeader');
goog.require('jssip.testing.util.parseutil');

describe('jssip.sip.protocol.header.ViaHeaderParserFactory', function() {
  var testHeaderName = 'Via';

  var mockControl;
  var mockHeaderParserFactory;
  var mockHeaderParser;

  var parserFactory;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();
    mockHeaderParserFactory =
        jssip.testing.util.parseutil.createMockHeaderParserFactory(mockControl);
    mockHeaderParser =
        jssip.testing.util.parseutil.createMockHeaderParser(mockControl);

    parserFactory = new jssip.sip.protocol.header.ViaHeaderParserFactory(
        mockHeaderParserFactory, testHeaderName);
  });

  describe('parsing via header values', function() {
    var setupMocks = function(value) {
      var headerResult = new jssip.message.HeaderImpl(testHeaderName, value,
          jssip.sip.grammar.rfc3261.parse(value, testHeaderName));

      mockHeaderParserFactory.createParser(value).$returns(mockHeaderParser);
      mockHeaderParser.initializeHeaderName(testHeaderName);
      mockHeaderParser.parse().$returns(headerResult);
    };

    it('should parse a via header', function() {
      var viaValue = 'SIP/2.0/UDP 10.0.1.12:5060;branch=z9hG4bK-393537-8a';
      setupMocks(viaValue);

      mockControl.$replayAll();
      var parser = parserFactory.createParser(viaValue);
      var header = parser.parse();
      mockControl.$verifyAll();

      expect(header).
          toEqual(jasmine.any(jssip.sip.protocol.header.ViaHeader));
      var primaryViaParm = header.getViaParm();

      var expectedParams = new jssip.sip.protocol.ParsedParams(
          [[';', ['branch', '=', 'z9hG4bK-393537-8a']]]);
      var expectedViaParm = new jssip.sip.protocol.ViaParm(
          'SIP', '2.0', 'UDP', '10.0.1.12', '5060', expectedParams);
      expect(expectedViaParm.equals(primaryViaParm)).toBe(true);
    });
  });
});
