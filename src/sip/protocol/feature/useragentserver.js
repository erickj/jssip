goog.provide('jssip.sip.protocol.feature.UserAgentServer');



/**
 * The feature facade for the feature registering as the UserAgentServer MUST
 * implement this interface.
 * @interface
 */
jssip.sip.protocol.feature.UserAgentServer = function() {};


/** @const {string} */
jssip.sip.protocol.feature.UserAgentServer.TYPE = 'feature-useragentserver';


/** @enum {string} */
jssip.sip.protocol.feature.UserAgentServer.EventType = {
  CREATE_RESPOSNE: 'uas-create-response',
  RECEIVE_REQUEST: 'uas-receive-request'
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.feature.UserAgentServer.prototype.handleRequest =
    function(messageContext) {};
