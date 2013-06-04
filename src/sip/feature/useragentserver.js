goog.provide('jssip.sip.feature.UserAgentServer');



/**
 * The feature facade for the feature registering as the UserAgentServer MUST
 * implement this interface.
 * @interface
 */
jssip.sip.feature.UserAgentServer = function() {
};


/** @enum {string} */
jssip.sip.feature.UserAgentServer.EventType = {
  CREATE_MESSAGE: 'uas-create-message',
  RECEIVE_MESSAGE: 'uas-receive-message',
  SEND_MESSAGE: 'uas-send-message'
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.feature.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
