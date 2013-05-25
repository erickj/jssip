goog.provide('jssip.core.feature.UserAgentServer');

goog.require('jssip.core.UserAgent');



/**
 * The feature facade for the feature registering as the UserAgentServer MUST
 * implement this interface.
 * @interface
 */
jssip.core.feature.UserAgentServer = function() {
};


/**
 * @const {jssip.core.UserAgent.CoreFeatureType}
 */
jssip.core.feature.UserAgentServer.FEATURE_TYPE =
    jssip.core.UserAgent.CoreFeatureType.USERAGENTSERVER;


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
