goog.provide('jssip.core.feature.UserAgentClient');

goog.require('jssip.core.UserAgent');



/**
 * The feature facade for the feature registering as the UserAgentClient MUST
 * implement this interface.
 * @interface
 */
jssip.core.feature.UserAgentClient = function() {
};


/**
 * @const {jssip.core.UserAgent.CoreFeatureType}
 */
jssip.core.feature.UserAgentClient.FEATURE_TYPE =
    jssip.core.UserAgent.CoreFeatureType.USERAGENTCLIENT;


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.UserAgentClient.prototype.handleResponse =
    function(messageContext) {};
