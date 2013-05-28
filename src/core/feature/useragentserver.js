goog.provide('jssip.core.feature.UserAgentServer');



/**
 * The feature facade for the feature registering as the UserAgentServer MUST
 * implement this interface.
 * @interface
 */
jssip.core.feature.UserAgentServer = function() {
};


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
