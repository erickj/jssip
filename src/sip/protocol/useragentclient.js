goog.provide('jssip.sip.protocol.UserAgentClient');



/**
 * The feature facade for the feature registering as the UserAgentClient MUST
 * implement this interface.
 * @interface
 */
jssip.sip.protocol.UserAgentClient = function() {
};


/** @enum {string} */
jssip.sip.protocol.UserAgentClient.EventType = {
  CREATE_REQUEST: 'uac-create-request',
  RECEIVE_RESPONSE: 'uac-receive-response'
};


/**
 * Adds UAC header fields to the given message builder.  Uses the request URI to
 * generate a To URI for the message.  Returns a new message builder.
 *
 * For general information on UAC request generation:
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1}
 *
 * For details on setting the request URI, event for requests outside of a
 * dialog:
 * @see {http://tools.ietf.org/html/rfc3261#section-12.2.1.1}
 *
 * @param {!jssip.message.Message.Builder} messageBuilder A message builder.
 * @param {string} method The SIP request method.
 * @param {!jssip.uri.Uri} toUri The logical destination for this request.
 * @return {!jssip.message.BuilderMessageContext}
 */
jssip.sip.protocol.UserAgentClient.prototype.createRequest =
    goog.abstractMethod;


/**
 * @param {!jssip.message.MessageContext} responseMessageContext
 */
jssip.sip.protocol.UserAgentClient.prototype.handleResponse =
    goog.abstractMethod;
