goog.provide('jssip.sip.protocol.feature.UserAgentClient');



/**
 * The feature facade for the feature registering as the UserAgentClient MUST
 * implement this interface.
 * @interface
 */
jssip.sip.protocol.feature.UserAgentClient = function() {};


/** @const {string} */
jssip.sip.protocol.feature.UserAgentClient.TYPE = 'feature-useragentclient';


/** @enum {string} */
jssip.sip.protocol.feature.UserAgentClient.EventType = {
  CREATE_REQUEST: 'uac-create-request',
  RECEIVE_RESPONSE: 'uac-receive-response',
  SENT_REQUEST: 'uac-sent-request'
};


/**
 * For general information on UAC request generation:
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1}
 *
 * For details on setting the request URI, event for requests outside of a
 * dialog:
 * @see {http://tools.ietf.org/html/rfc3261#section-12.2.1.1}
 *
 * @param {string} method The SIP request method.
 * @param {!jssip.sip.protocol.NameAddr} toNameAddr An addr-spec or name-addr
 *     for the logical recipient of this request. May be supplanted by Dialog
 *     info.
 * @param {!jssip.sip.protocol.NameAddr} fromNameAddr An addr-spec or name-addr
 *     for the logical sender of this request. May be supplanted by Dialog info.
 * @param {!jssip.sip.protocol.Dialog=} opt_dialog The dialog this request
 *     exists inside of.
 * @return {!jssip.message.BuilderMessageContext}
 */
jssip.sip.protocol.feature.UserAgentClient.prototype.createRequest =
    goog.abstractMethod;


/**
 * Sends a request. Returns a deferred response that indicates the request was
 * eventually sent across the transport layer to the message destination.  A
 * successful response does not indicate anything about the response to the
 * request.
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.2}
 *
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @return {!jssip.async.Promise.<boolean>} Whether transport to the destination
 *     succeeded.
 */
jssip.sip.protocol.feature.UserAgentClient.prototype.sendRequest =
    goog.abstractMethod;


/**
 * @param {!jssip.message.MessageContext} responseMessageContext
 */
jssip.sip.protocol.feature.UserAgentClient.prototype.handleResponse =
    goog.abstractMethod;
