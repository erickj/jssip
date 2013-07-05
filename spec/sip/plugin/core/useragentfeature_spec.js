goog.provide('jssip.sip.plugin.core.UserAgentFeatureSpec');

goog.require('goog.object');
goog.require('jssip.event.EventBus');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.sip.UserAgent.Config');
goog.require('jssip.sip.plugin.core.UserAgentFeature');
goog.require('jssip.sip.protocol.feature.UserAgentClient');
goog.require('jssip.sip.protocol.header.NameAddrListHeaderParserFactory');
goog.require('jssip.sip.protocol.header.ViaHeaderParserFactory');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.testing.util.featureutil');
goog.require('jssip.testing.util.messageutil');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');


describe('jssip.sip.plugin.core.UserAgentFeature', function() {
  var rfc3261 = jssip.sip.protocol.rfc3261;
  var exampleMessage = jssip.testing.util.messageutil.ExampleMessage;

  var userAgentFeature;
  var userAgentConfig;
  var eventBus;
  var featureName = 'useragentfeature';
  var featureContext;
  var eventListener;
  var messageBuilder;

  beforeEach(function() {
    var propertyMap = {};
    propertyMap[jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD] =
        'erick@bar.com';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.DISPLAY_NAME] =
        'EJ';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.OUTBOUND_PROXY] =
        'sip.ejjohnson.org:5060';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.VIA_SENT_BY] =
        '10.1.1.1:5061';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.CONTACT] =
        '20.2.2.2:5062';

    eventBus = new jssip.event.EventBus();
    featureContext = jssip.testing.util.featureutil.createFeatureContext(
      eventBus, propertyMap);

    messageBuilder = new jssip.message.Message.Builder();

    userAgentConfig = new jssip.sip.UserAgent.Config([featureName])
    userAgentFeature = new jssip.sip.plugin.core.UserAgentFeature(
        featureName);
    userAgentFeature.activate(featureContext);
  });

  describe('#getHeaderParserFactory', function() {
    it('throws if the feature is not yet activated', function() {
      userAgentFeature = new jssip.sip.plugin.core.UserAgentFeature(
          'unactivated-feature');
      expect(function() {
        userAgentFeature.getHeaderParserFactory('From');
      }).toThrow();
    });

    it('throws if the header type is not one declared in 3261',
       function() {
         expect(function() {
           userAgentFeature.getHeaderParserFactory('Foobars');
         }).toThrow();
       });

    describe('3261 headers', function() {
      var customHeaderParserFactories = {
        Contact: jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        Route: jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        'Record-Route':
            jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        To: jssip.sip.protocol.header.NameAddrHeaderParserFactory,
        From:jssip.sip.protocol.header.NameAddrHeaderParserFactory,
        Via: jssip.sip.protocol.header.ViaHeaderParserFactory
      };

      for (var headerKey in jssip.sip.protocol.rfc3261.HeaderType) {
        var hdr = jssip.sip.protocol.rfc3261.HeaderType[headerKey];
        var msg = 'returns a header parser for header ' + hdr;
        it(msg, function(hdr) {
          return function() {
            var parser = userAgentFeature.getHeaderParserFactory(hdr);
            expect(parser).toEqual(jasmine.any(
                customHeaderParserFactories[hdr] ||
                    jssip.sip.plugin.core.HeaderParserFactoryImpl));
          };
        }(hdr));
      };
    });

    describe('custom header parser factory', function() {
      describe('To and From headers', function() {
        var nameAddrHeaderParsers = ['To', 'From'];
        var nameAddr = 'sip:erick@bar.com;tag=1234';
        for (var i = 0; i < nameAddrHeaderParsers.length; i++) {
          var hdr = nameAddrHeaderParsers[i];

          it('parses NameAddr objects for header ' + hdr, function(hdr) {
            return function() {
              var parserFactory = userAgentFeature.getHeaderParserFactory(hdr);
              var parser = parserFactory.createParser(nameAddr);
              var header = parser.parse();
              expect(header.getHeaderName()).toBe(hdr);
              expect(header.getNameAddr()).toEqual(jasmine.any(
                jssip.sip.protocol.NameAddr))
              expect(header.getNameAddr().getContextParams().getParameter('tag')).
                toBe('1234');
            };
          }(hdr));
        };
      });
    });
  });

  describe('#getUriParserFactory', function() {
    it('throws if the scheme is not SIP or SIPS', function() {
      expect(function() {
        userAgentFeature.getUriParserFactory('foo');
      }).toThrow();
    });

    it('returns a SipUriParserFactory for SIP and SIPS schemes', function() {
      expect(userAgentFeature.getUriParserFactory(jssip.uri.Uri.Scheme.SIP)).
          toEqual(jasmine.any(jssip.sip.plugin.core.SipUriParserFactory));
      expect(userAgentFeature.getUriParserFactory(jssip.uri.Uri.Scheme.SIPS)).
          toEqual(jasmine.any(jssip.sip.plugin.core.SipUriParserFactory));
    });
  });

  describe('#handleRespose', function() {
    beforeEach(function() {
      eventListener = jasmine.createSpy();
      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.RECEIVE_RESPONSE,
          eventListener);
    });

    it('emits RECEIVE_RESPONSE events', function() {
      var rawMessageContext = jssip.testing.util.messageutil.createRawMessageContext(
          exampleMessage.INVITE_200_OK);

      userAgentFeature.handleResponse(rawMessageContext);
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toBe(rawMessageContext);
    });

    it('throws an error if it receives a request', function() {
      var exampleMessage = jssip.testing.util.messageutil.ExampleMessage;

      expect(function() {
        userAgentFeature.handleResponse(
            jssip.testing.util.messageutil.createRawMessageContext(
                exampleMessage.INVITE));
      }).toThrow();
    });
  });

  describe('#createRequest', function() {
    var toUri;

    beforeEach(function() {
      eventListener = jasmine.createSpy();
      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST,
          eventListener);

      toUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'im.lazy').build();
    });

    it('adds to the message builder provided', function() {
      userAgentFeature.createRequest(messageBuilder, 'FOOSBAR', toUri);

      var message = messageBuilder.build();
      expect(message.isRequest()).toBe(true);
      expect(message.getMethod()).toBe('FOOSBAR');
      expect(message.getRequestUri()).toBe(toUri.toString());

      // TODO(erick): This is really shitty, I'm just copying code'
      var headerType = rfc3261.HeaderType;
      jssip.testing.util.messageutil.checkMessageHeaders(goog.object.create(
        headerType.TO, toUri.toString(),
        headerType.FROM, /EJ <sip:erick@bar.com>;tag=[a-f0-9]+/,
        headerType.CALL_ID, /[a-f0-9]+/,
        headerType.CSEQ, /[0-9]+ FOOSBAR/,
        headerType.MAX_FORWARDS, '70'
      ), message);
    });

    it('dispatches a CREATE_RESPONSE event', function() {
      userAgentFeature.createRequest(messageBuilder, 'INVITE', toUri)
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toEqual(
          jasmine.any(jssip.message.BuilderMessageContext));
    });

    it('is possible to add and override message headers', function() {
      eventListener = function(evt) {
        var builder = evt.messageContext.getBuilder();
        builder.setHeader('X-Foobar', 'xfoo');
        builder.setHeader('From', 'yomama', true /* opt_overwrite */);
      };

      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST,
          eventListener);
      userAgentFeature.createRequest(messageBuilder, 'INVITE', toUri)
      var message = messageBuilder.build();
      var headerType = rfc3261.HeaderType;
      jssip.testing.util.messageutil.checkMessageHeaders(goog.object.create(
        'X-Foobar', 'xfoo',
        'From', 'yomama'
      ), message);
    });
  });
});
