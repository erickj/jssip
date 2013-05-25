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


/** @enum {string} */
jssip.core.feature.UserAgentServer.EventType = {
  CREATE_MESSAGE: 'uas-create-message',
  RECEIVE_MESSAGE: 'uas-receive-message',
  SEND_MESSAGE: 'uas-send-message'
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
