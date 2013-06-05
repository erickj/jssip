goog.provide('jssip.sip.plugin.core.UserAgentFeatureSpec');

goog.require('goog.object');
goog.require('jssip.event.EventBus');
goog.require('jssip.message.Message.Builder');
goog.require('jssip.sip.UserAgent.Config');
goog.require('jssip.sip.plugin.core.UserAgentFeature');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.testing.util.featureutil');
goog.require('jssip.testing.util.messageutil');

describe('jssip.sip.plugin.core.UserAgentFeature', function() {
  var rfc3261 = jssip.sip.protocol.rfc3261;

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

  describe('#createRequest', function() {
    var requestUri;

    beforeEach(function() {
      eventListener = jasmine.createSpy();
      eventBus.addEventListener(
          jssip.sip.protocol.UserAgentClient.EventType.CREATE_MESSAGE,
          eventListener);

      requestUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'im.lazy').build();
    });

    it('should decorate the message builder provided', function() {
      userAgentFeature.createRequest(messageBuilder, 'FOOSBAR', requestUri);

      var message = messageBuilder.build();
      expect(message.isRequest()).toBe(true);
      expect(message.getMethod()).toBe('FOOSBAR');
      expect(message.getRequestUri()).toBe(requestUri.toString());

      // TODO(erick): This is really shitty, I'm just copying code'
      var headerType = rfc3261.HeaderType;
      jssip.testing.util.messageutil.checkMessageHeaders(goog.object.create(
        headerType.TO, requestUri.toString(),
        headerType.FROM, /EJ <sip:erick@bar.com>;tag=[a-f0-9]+/,
        headerType.CALL_ID, /[a-f0-9]+/,
        headerType.CSEQ, /[0-9]+ FOOSBAR/,
        headerType.MAX_FORWARDS, '70',
        headerType.VIA, /^SIP\/2\.0\/UDP\s+10.1.1.1:5061;branch=z9hG4bK-[a-f0-9]+/
      ), message);
    });

    it('should dispatch a CREATE_MESSAGE event', function() {
      userAgentFeature.createRequest(messageBuilder, 'INVITE', requestUri)
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
          jssip.sip.protocol.UserAgentClient.EventType.CREATE_MESSAGE,
          eventListener);
      userAgentFeature.createRequest(messageBuilder, 'INVITE', requestUri)
      var message = messageBuilder.build();
      var headerType = rfc3261.HeaderType;
      jssip.testing.util.messageutil.checkMessageHeaders(goog.object.create(
        'X-Foobar', 'xfoo',
        'From', 'yomama'
      ), message);
    });
  });
});
