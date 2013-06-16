goog.provide('jssip.sip.plugin.core.header.ContactHeaderParserFactorySpec');

goog.require('jssip.event.EventBus');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.sip.plugin.core.HeaderParserFactoryImpl');
goog.require('jssip.sip.plugin.core.SipUriParserFactory');
goog.require('jssip.sip.plugin.core.header.ContactHeader');
goog.require('jssip.sip.plugin.core.header.ContactHeaderParserFactory');

describe('jssip.sip.plugin.core.header.ContactHeaderParserFactory', function() {
  var headerParserFactory;
  var contactHeaderParserFactory;

  beforeEach(function() {
    var eventBus = new jssip.event.EventBus();
    var messageParserFactory =
        /** @type {!jssip.message.MessageParserFactory} */ ({});
    var sipUriParserFactory =
        new jssip.sip.plugin.core.SipUriParserFactory(eventBus);
    var parserRegistry =
        new jssip.parser.ParserRegistry(messageParserFactory, eventBus);
    parserRegistry.registerUriParserFactory('sip', sipUriParserFactory);
    headerParserFactory =
        new jssip.sip.plugin.core.HeaderParserFactoryImpl(eventBus);

    contactHeaderParserFactory =
        new jssip.sip.plugin.core.header.ContactHeaderParserFactory(
            headerParserFactory, parserRegistry);
  });

  describe('parsing contact header values', function() {
    var nameAddrContactValue =
        '"Erick" <sip:erick@10.0.1.12:5060;transport=udp>;expires=600;foo';
    var addrSpecContactValue = 'sip:erick@10.0.1.12:5060;expires=600;foo';
    var uriStr = 'sip:erick@10.0.1.12:5060';

    it('should parse a name-addr format contact header', function() {
      var parser =
          contactHeaderParserFactory.createParser(nameAddrContactValue);
      var header = parser.parse();
      expect(header).
          toEqual(jasmine.any(jssip.sip.plugin.core.header.ContactHeader));

      var primaryNameAddr = header.getNameAddrList()[0];
      expect(primaryNameAddr.getUri().toString()).
          toBe(uriStr + ';transport=udp');
      expect(primaryNameAddr.getDisplayName()).toBe('"Erick"');
      expect(primaryNameAddr.getContextParams().getParameter('expires')).
          toBe('600');
      expect(primaryNameAddr.getContextParams().getParameter('foo')).toBe(true);
    });

    it('should parse an addr-spec format contact header', function() {
      var parser =
          contactHeaderParserFactory.createParser(addrSpecContactValue);
      var header = parser.parse();
      expect(header).
          toEqual(jasmine.any(jssip.sip.plugin.core.header.ContactHeader));

      var primaryNameAddr = header.getNameAddrList()[0];
      expect(primaryNameAddr.getUri().toString()).toBe(uriStr);
      expect(primaryNameAddr.getDisplayName()).toBe('');
      expect(primaryNameAddr.getContextParams().getParameter('expires')).
          toBe('600');
      expect(primaryNameAddr.getContextParams().getParameter('foo')).toBe(true);
    });
  });
});
