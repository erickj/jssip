goog.provide('jssip.sip.protocol.NameAddr');



/**
 * The name-addr defined in the SIP ABNF does not contain params as part of the
 * spec, however a name-addr is used together with contextual params throughout
 * the protocol.
 * @param {!jssip.uri.Uri} uri
 * @param {string=} opt_displayName
 * @param {!Array.<!Array.<string>>=} opt_contextParams
 * @constructor
 */
jssip.sip.protocol.NameAddr =
    function(uri, opt_displayName, opt_contextParams) {
  /** @private {!jssip.uri.Uri} */
  this.uri_ = uri;

  /** @private {string} */
  this.displayName_ = opt_displayName || '';

  /** @private {!Object} */
  this.contextParams_ = opt_contextParams || [];
};
