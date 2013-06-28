goog.provide('jssip.sip.protocol.header.NameAddrListHeaderParserFactorySpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.message.HeaderImpl');
goog.require('jssip.sip.grammar.rfc3261');
goog.require('jssip.sip.protocol.header.NameAddrListHeaderParserFactory');
goog.require('jssip.sip.protocol.header.NameAddrListHeader');
goog.require('jssip.testing.util.parseutil');

describe('jssip.sip.protocol.header.NameAddrListHeaderParserFactory', function() {
  var testHeaderName = 'Contact';

  var mockControl;
  var mockHeaderParserFactory;
  var mockHeaderParser;
  var mockParserRegistry;

  var parserFactory;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();
    mockHeaderParserFactory =
        jssip.testing.util.parseutil.createMockHeaderParserFactory(mockControl);
    mockHeaderParser =
        jssip.testing.util.parseutil.createMockHeaderParser(mockControl);
    mockParserRegistry =
        jssip.testing.util.parseutil.createMockParserRegistry(mockControl);

    parserFactory =
        new jssip.sip.protocol.header.NameAddrListHeaderParserFactory(
            mockHeaderParserFactory, testHeaderName, mockParserRegistry);
  });

  describe('parsing contact header values', function() {
    var setupMocks = function(value, parsedUris) {
      var headerResult = new jssip.message.HeaderImpl(testHeaderName, value,
          jssip.sip.grammar.rfc3261.parse(value, testHeaderName));

      mockHeaderParserFactory.createParser(value).$returns(mockHeaderParser);
      mockHeaderParser.initializeHeaderName(testHeaderName);
      mockHeaderParser.parse().$returns(headerResult);

      for (var i = 0; i < parsedUris.length; i++) {
        var uri = parsedUris[i];
        var obj = parsedUris[++i];
        mockParserRegistry.parseUri(uri).$returns(obj);
      }
    };

    it('should parse a name-addr format contact header', function() {
      var nameAddrContactValue =
          '"Erick" <sip:erick@1.2.3.4:5060;transport=udp>;expires=600;foo';
      var parsedUri = {};
      var parsedUris =  [
        'sip:erick@1.2.3.4:5060;transport=udp', parsedUri
      ];
      setupMocks(nameAddrContactValue, parsedUris);

      mockControl.$replayAll();
      var parser = parserFactory.createParser(nameAddrContactValue);
      var header = parser.parse();
      mockControl.$verifyAll();

      expect(header).
          toEqual(jasmine.any(jssip.sip.protocol.header.NameAddrListHeader));

      var primaryNameAddr = header.getNameAddrList()[0];

      expect(primaryNameAddr.getUri()).toBe(parsedUri);
      expect(primaryNameAddr.getDisplayName()).toBe('"Erick"');
      expect(primaryNameAddr.getContextParams().getParameter('expires')).
          toBe('600');
      expect(primaryNameAddr.getContextParams().getParameter('foo')).toBe(true);
    });

    it('should parse an addr-spec format contact header', function() {
      var addrSpecContactValue = 'sip:erick@1.2.3.4:5060;expires=600;foo';
      var parsedUri = {};
      var parsedUris = [
        'sip:erick@1.2.3.4:5060', parsedUri
      ];

      setupMocks(addrSpecContactValue, parsedUris);

      mockControl.$replayAll();
      var parser = parserFactory.createParser(addrSpecContactValue);
      var header = parser.parse();
      mockControl.$verifyAll();

      expect(header).
          toEqual(jasmine.any(jssip.sip.protocol.header.NameAddrListHeader));

      var primaryNameAddr = header.getNameAddrList()[0];
      expect(primaryNameAddr.getUri()).toBe(parsedUri);
      expect(primaryNameAddr.getDisplayName()).toBe('');
      expect(primaryNameAddr.getContextParams().getParameter('expires')).
          toBe('600');
      expect(primaryNameAddr.getContextParams().getParameter('foo')).toBe(true);
    });

    it('should parse contacts with comma separated values', function() {
      var multiAddrContactValue = 'sip:erick@4.3.2.1,sip:erick@1.2.3.4';
      var parsedUris =  [
        'sip:erick@4.3.2.1', {},
        'sip:erick@1.2.3.4', {}
      ];

      setupMocks(multiAddrContactValue, parsedUris);

      mockControl.$replayAll();
      var parser = parserFactory.createParser(multiAddrContactValue);
      var header = parser.parse();
      mockControl.$verifyAll();

      expect(header).
          toEqual(jasmine.any(jssip.sip.protocol.header.NameAddrListHeader));
      expect(header.getNameAddrList().length).toBe(2);
    });
  });
});
