goog.provide('jssip.sip.protocol.UserAgentClient');

goog.require('jssip.sip.UserAgent');



/**
 * The feature facade for the feature registering as the UserAgentClient MUST
 * implement this interface.
 * @interface
 */
jssip.sip.protocol.UserAgentClient = function() {
};


/** @enum {string} */
jssip.sip.protocol.UserAgentClient.EventType = {
  CREATE_MESSAGE: 'uac-create-message',
  RECEIVE_MESSAGE: 'uac-receive-message',
  SEND_MESSAGE: 'uac-send-message'
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
 * @param {!jssip.uri.Uri} requestUri A URI.
 */
jssip.sip.protocol.UserAgentClient.prototype.createRequest =
    function(messageBuilder, method, requestUri) {};


/**
 * Sends a request message.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.UserAgentClient.prototype.sendRequest =
    function(messageContext) {};


/**
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.UserAgentClient.prototype.handleResponse =
    function(messageContext) {};
