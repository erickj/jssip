goog.provide('jssip.testing.util.featureutil');

goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.platform.PlatformContext');
goog.require('jssip.plugin.FeatureContext');
goog.require('jssip.sip.SipContext');
goog.require('jssip.sip.protocol.feature.TransportLayer');
goog.require('jssip.storage.SimpleMemoryStorage');
goog.require('jssip.testing.util.netutil.StubResolver');


/**
 * @param {!jssip.event.EventBus=} opt_eventBus The event bus to use for all
 *     messaging.  Or a default one will be created.
 * @param {!Object=} opt_userAgentPropertyMap A map of user agent config
 *     properties and their return value.
 * @param {!jssip.net.Resolver=} opt_resolver
 * @return {!jssip.plugin.FeatureContext}
 */
jssip.testing.util.featureutil.createFeatureContext =
    function(opt_eventBus, opt_userAgentPropertyMap, opt_resolver) {
  opt_eventBus = opt_eventBus || new jssip.event.EventBus();
  opt_userAgentPropertyMap = opt_userAgentPropertyMap || {};

  var messageParserFactory =
      new jssip.message.MessageParserFactory(opt_eventBus);
  var parserRegistry = new jssip.parser.ParserRegistry(messageParserFactory);
  var featureContext = new jssip.plugin.FeatureContext();

  var resolver =
      opt_resolver || new jssip.testing.util.netutil.StubResolver();
  var platformContext = new jssip.platform.PlatformContext();
  goog.mixin(platformContext, {
    getResolver: function() { return resolver; }
  });

  var storage = new jssip.storage.SimpleMemoryStorage();
  var preloadedRoutes = [];
  var sipContext = new jssip.sip.SipContext(storage, preloadedRoutes);

  goog.mixin(featureContext, {
    getSipContext: function() { return sipContext; },
    getPlatformContext: function() { return platformContext; },
    getParserRegistry: function() { return parserRegistry; },
    getEventBus: function() { return opt_eventBus; },
    getUserAgentConfigProperty: function(k) {
      return opt_userAgentPropertyMap[k];
    }
  });

  return featureContext;
};


/**
 * Creates a mock transport layer
 * @return {!jssip.sip.protocol.feature.TransportLayer}
 */
jssip.testing.util.featureutil.createMockTransportLayer = function(ctrl) {
  return ctrl.createLooseMock(jssip.sip.protocol.feature.TransportLayer);
};
