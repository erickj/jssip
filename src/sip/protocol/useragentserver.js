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
  CREATE_RESPOSNE: 'uas-create-response',
  RECEIVE_REQUEST: 'uas-receive-request'
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
