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


/** @enum {string} */
jssip.core.feature.UserAgentClient.EventType = {
  CREATE_MESSAGE: 'uac-create-message',
  RECEIVE_MESSAGE: 'uac-receive-message',
  SEND_MESSAGE: 'uac-send-message'
};


/**
 * @param {string|!jssip.uri.Uri} uri A URI.
 * @param {string} method A request method.
 */
jssip.core.feature.UserAgentClient.prototype.createRequest =
    function(uri, method) {};


/**
 * Sends a request message.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.UserAgentClient.prototype.sendRequest =
    function(messageContext) {};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.UserAgentClient.prototype.handleResponse =
    function(messageContext) {};
