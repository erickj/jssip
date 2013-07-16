goog.provide('jssip.sip.plugin.core.MessageDestinationFetcherSpec');

goog.require('goog.net.IpAddress');
goog.require('goog.testing.MockControl');
goog.require('jssip.sip.plugin.core.MessageDestinationFetcher');
goog.require('jssip.sip.protocol.MessageDestination');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.header.NameAddrListHeader');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.testing.util.messageutil');
goog.require('jssip.testing.util.netutil.StubResolver');
goog.require('jssip.testing.util.parseutil');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.sip.plugin.core.MessageDestinationFetcher', function() {
  var mockControl;
  var messageDestinationFetcher;
  var aRecordStubMap = {
    'example.com': ['1.2.3.4'],
    'examples.com': ['2.3.4.5', '6.7.8.9']
  }
  var fakeUriParser;
  var setupStrictRoutingMessageContext;
  var setupLooseRoutingMessageContext;
  var setupMessageContext;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();

    var parserRegistry =
        jssip.testing.util.parseutil.createParserRegistry();
    fakeUriParser = new jssip.testing.util.parseutil.FakeUriParser();
    parserRegistry.registerUriParserFactory('sip', fakeUriParser);

    var sipContext = jssip.testing.util.messageutil.createSipContext();
    var resolver = new jssip.testing.util.netutil.StubResolver(aRecordStubMap);

    messageDestinationFetcher = new jssip.sip.plugin.core.
        MessageDestinationFetcher(resolver, sipContext, parserRegistry);
  });

  describe('#fetchDestinationForRequest', function() {
    var mockMessageContext;
    var simpleUriBuilder;

    beforeEach(function() {
      mockMessageContext = jssip.testing.util.messageutil.
          createMockMessageContext(mockControl);
      simpleUriBuilder = new jssip.uri.Uri.Builder().
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'erick').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, '10.0.1.12').
          addUriParser(fakeUriParser);
    });

    describe('URI for A record lookup', function() {
      it('looks up the hostname from the resolver', function() {
        simpleUriBuilder.
            addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'example.com');

        setupMessageContext(mockMessageContext, simpleUriBuilder);
        mockControl.$replayAll();

        var promiseOfDestinations = messageDestinationFetcher.
            fetchDestinationsForRequest(mockMessageContext);
        var expected = new jssip.sip.protocol.MessageDestination(
            goog.net.IpAddress.fromString('1.2.3.4'),
            5060,
            jssip.net.Socket.Type.UDP);

        expect(promiseOfDestinations).toPromiseSuccess(
          function(messageDestinations) {
            expect(messageDestinations.length).toBe(1);
            expect(expected.equals(messageDestinations[0])).toBe(true);
          });

        mockControl.$verifyAll();
      });

      it('returns multiple destinations for records with more than one address',
         function() {
           simpleUriBuilder.
               addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'examples.com');

           setupMessageContext(mockMessageContext, simpleUriBuilder);
           mockControl.$replayAll();

           var promiseOfDestinations = messageDestinationFetcher.
               fetchDestinationsForRequest(mockMessageContext);
           var expected1 = new jssip.sip.protocol.MessageDestination(
               goog.net.IpAddress.fromString('2.3.4.5'),
               5060,
               jssip.net.Socket.Type.UDP);
           var expected2 = new jssip.sip.protocol.MessageDestination(
               goog.net.IpAddress.fromString('6.7.8.9'),
               5060,
               jssip.net.Socket.Type.UDP);

           expect(promiseOfDestinations).toPromiseSuccess(
             function(messageDestinations) {
               expect(messageDestinations.length).toBe(2);
               expect(expected1.equals(messageDestinations[0])).toBe(true);
               expect(expected2.equals(messageDestinations[1])).toBe(true);
             });

           mockControl.$verifyAll();
         });

      it('returns a failed promise for records with no addresses', function() {
        simpleUriBuilder.
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'norecords.com');

        setupMessageContext(mockMessageContext, simpleUriBuilder);
        mockControl.$replayAll();

        var promiseOfDestinations = messageDestinationFetcher.
          fetchDestinationsForRequest(mockMessageContext);

        expect(promiseOfDestinations).toPromiseError(
          function(error) {
            expect(error).toEqual(jasmine.any(Error));
          });

        mockControl.$verifyAll();
      });
    });

    describe('URI with transport param', function() {
      it('builds the destination socket type from the transport value', function() {
        simpleUriBuilder.addPropertyPair(
            jssip.uri.Uri.PropertyName.PARAMETERS, 'transport=tcp');

        setupMessageContext(mockMessageContext, simpleUriBuilder);
        mockControl.$replayAll();

        var promiseOfDestinations = messageDestinationFetcher.
            fetchDestinationsForRequest(mockMessageContext);
        var expected = new jssip.sip.protocol.MessageDestination(
            goog.net.IpAddress.fromString('10.0.1.12'),
            5060,
            jssip.net.Socket.Type.TCP);

        expect(promiseOfDestinations).toPromiseSuccess(
          function(messageDestinations) {
            expect(messageDestinations.length).toBe(1);
            expect(expected.equals(messageDestinations[0])).toBe(true);
          });

        mockControl.$verifyAll();
      });
    });

    describe('strict routing', function() {
      it('builds the destination from the request URI', function() {
        setupStrictRoutingMessageContext(mockMessageContext, simpleUriBuilder);

        mockControl.$replayAll();

        var promiseOfDestinations = messageDestinationFetcher.
            fetchDestinationsForRequest(mockMessageContext);
        var expected = new jssip.sip.protocol.MessageDestination(
            goog.net.IpAddress.fromString('10.0.1.12'),
            5060,
            jssip.net.Socket.Type.UDP);

        expect(promiseOfDestinations).toPromiseSuccess(
          function(messageDestinations) {
            expect(messageDestinations.length).toBe(1);
            expect(expected.equals(messageDestinations[0])).toBe(true);
          });

        mockControl.$verifyAll();
      });
    });

    describe('loose routing', function() {
      it('builds the destination from the Route header', function() {
        var nameAddrs =
            [new jssip.sip.protocol.NameAddr(simpleUriBuilder.build())];
        setupLooseRoutingMessageContext(
            mockMessageContext, simpleUriBuilder, nameAddrs);

        mockControl.$replayAll();

        var promiseOfDestinations = messageDestinationFetcher.
          fetchDestinationsForRequest(mockMessageContext);

        var expected = new jssip.sip.protocol.MessageDestination(
          goog.net.IpAddress.fromString('10.0.1.12'),
          5060,
          jssip.net.Socket.Type.UDP);

        expect(promiseOfDestinations).toPromiseSuccess(
          function(messageDestinations) {
            expect(messageDestinations.length).toBe(1);
            expect(expected.equals(messageDestinations[0])).toBe(true);
          });

        mockControl.$verifyAll();
      });
    });
  });

  setupStrictRoutingMessageContext = function(mockMessageContext, uriBuilder) {
    var uri = uriBuilder.build();

    mockMessageContext.isStrictRouting().$returns(true);
    mockMessageContext.getRequestUri().$returns(uri.stringify());
    fakeUriParser.setUri(uri);
  }

  setupLooseRoutingMessageContext =
      function(mockMessageContext, uriBuilder, nameAddrs)  {
    var uri = uriBuilder.build();
    fakeUriParser.setUri(uri);

    var header = new jssip.sip.protocol.header.NameAddrListHeader(
        /** @type {!jssip.message.Header} */ ({}), nameAddrs);

    mockMessageContext.isStrictRouting().$returns(false);
    mockMessageContext.
        getParsedHeader(jssip.sip.protocol.rfc3261.HeaderType.ROUTE).
        $returns([header]);
  };

  setupMessageContext = setupStrictRoutingMessageContext;
});
