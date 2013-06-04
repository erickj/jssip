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
 * Creates a message builder that this UAC will use as a request message.  A new
 * CALL-ID and CSEQ will be generated for this message.
 *
 * For general information on UAC request generation:
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1}
 *
 * For details on setting the request URI, event for requests outside of a
 * dialog:
 * @see {http://tools.ietf.org/html/rfc3261#section-12.2.1.1}
 *
 * @param {string} method A request method.
 * @param {!jssip.uri.Uri} requestUri A URI.
 * @param {!jssip.uri.Uri=} opt_toUri A URI to use for TO header, if
 *     none is provided the {@code requestUri} will be used.
 * @return {!jssip.message.Message}
 */
jssip.sip.protocol.UserAgentClient.prototype.createRequest =
    function(method, requestUri, opt_toUri) {};


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
