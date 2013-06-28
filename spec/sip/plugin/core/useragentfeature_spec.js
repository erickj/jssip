goog.provide('jssip.sip.plugin.core.UserAgentFeatureSpec');

goog.require('goog.object');
goog.require('jssip.event.EventBus');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.sip.UserAgent.Config');
goog.require('jssip.sip.plugin.core.UserAgentFeature');
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
    it('should throw if the feature is not yet activated', function() {
      userAgentFeature = new jssip.sip.plugin.core.UserAgentFeature(
          'unactivated-feature');
      expect(function() {
        userAgentFeature.getHeaderParserFactory('From');
      }).toThrow();
    });

    it('should throw if the header type is not one declared in 3261',
       function() {
         expect(function() {
           userAgentFeature.getHeaderParserFactory('Foobars');
         }).toThrow();
       });


    for (var headerKey in jssip.sip.protocol.rfc3261.HeaderType) {
      it('should return a header parser for header ' + headerKey + ' in 3261',
         function() {
           var parser = userAgentFeature.getHeaderParserFactory(
               jssip.sip.protocol.rfc3261.HeaderType[headerKey]);
           expect(parser).toEqual(
               jasmine.any(jssip.sip.plugin.core.HeaderParserFactoryImpl));
         });
    };
  });

  describe('#getUriParserFactory', function() {
    it('should throw if the scheme is not SIP or SIPS', function() {
      expect(function() {
        userAgentFeature.getUriParserFactory('foo');
      }).toThrow();
    });

    it('should return a SipUriParserFactory for SIP and SIPS schemes', function() {
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
          jssip.sip.protocol.UserAgentClient.EventType.RECEIVE_RESPONSE,
          eventListener);
    });

    it('should emit RECEIVE_RESPONSE events', function() {
      var rawMessageContext = jssip.testing.util.messageutil.createRawMessageContext(
          exampleMessage.INVITE_200_OK);

      userAgentFeature.handleResponse(rawMessageContext);
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toBe(rawMessageContext);
    });

    it('should throw an error if it receives a request', function() {
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
          jssip.sip.protocol.UserAgentClient.EventType.CREATE_REQUEST,
          eventListener);

      toUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'im.lazy').build();
    });

    it('should add to the message builder provided', function() {
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
        headerType.MAX_FORWARDS, '70',
        headerType.VIA, /^SIP\/2\.0\/UDP\s+10.1.1.1:5061;branch=z9hG4bK-[a-f0-9]+/
      ), message);
    });

    it('should dispatch a CREATE_RESPONSE event', function() {
      userAgentFeature.createRequest(messageBuilder, 'INVITE', toUri)
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toEqual(
          jasmine.any(jssip.message.BuilderMessageContext));
    });

    it('should be possible to add and override message headers', function() {
      eventListener = function(evt) {
        var builder = evt.messageContext.getBuilder();
        builder.setHeader('X-Foobar', 'xfoo');
        builder.setHeader('From', 'yomama', true /* opt_overwrite */);
      };

      eventBus.addEventListener(
          jssip.sip.protocol.UserAgentClient.EventType.CREATE_REQUEST,
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
