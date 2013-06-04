goog.provide('jssip.testing.util.featureutil');

goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.plugin.FeatureContext');

/**
 * @param {!jssip.event.EventBus=} opt_eventBus The event bus to use for all
 *     messaging.  Or a default one will be created.
 * @param {!Object=} opt_userAgentPropertyMap A map of user agent config
 *     properties and their return value.
 * @return {!jssip.plugin.FeatureContext}
 */
jssip.testing.util.featureutil.createFeatureContext =
    function(opt_eventBus, opt_userAgentPropertyMap) {
  opt_eventBus = opt_eventBus || new jssip.event.EventBus();
  opt_userAgentPropertyMap = opt_userAgentPropertyMap || {};

  var messageParserFactory =
      new jssip.message.MessageParserFactory(opt_eventBus);
  var parserRegistry = new jssip.parser.ParserRegistry(messageParserFactory);
  var featureContext = new jssip.plugin.FeatureContext;
  goog.mixin(featureContext, {
    getParserRegistry: function() { return parserRegistry; },
    getEventBus: function() { return opt_eventBus; },
    getUserAgentConfigProperty: function(k) {
      return opt_userAgentPropertyMap[k];
    }
  });

  return featureContext;
};
