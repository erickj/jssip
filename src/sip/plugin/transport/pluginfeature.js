goog.provide('jssip.sip.plugin.transport.pluginfeature');
goog.provide('jssip.sip.plugin.transport.pluginfeature.ServerLocate');


/** @enum {string} */
jssip.sip.plugin.transport.pluginfeature.Type = {
  SERVER_LOCATE: 'transport-serverlocate'
}



/**
 * @interface
 */
jssip.sip.plugin.transport.pluginfeature.ServerLocate = function() {};


/**
 * RFC 3263 Details the client process for locating SIP servers
 *
 * @see http://tools.ietf.org/html/rfc3263#section-4
 * @param {jssip.uri.Uri} uri
 * @return {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.LookupResult>>}
 */
jssip.sip.plugin.transport.pluginfeature.ServerLocate.prototype.
    locateSipServerForUri = goog.abstractMethod;
