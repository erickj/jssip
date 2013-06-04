goog.provide('jssip.sip.protocol.UserAgentServer');



/**
 * The feature facade for the feature registering as the UserAgentServer MUST
 * implement this interface.
 * @interface
 */
jssip.sip.protocol.UserAgentServer = function() {
};


/** @enum {string} */
jssip.sip.protocol.UserAgentServer.EventType = {
  CREATE_MESSAGE: 'uas-create-message',
  RECEIVE_MESSAGE: 'uas-receive-message',
  SEND_MESSAGE: 'uas-send-message'
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
