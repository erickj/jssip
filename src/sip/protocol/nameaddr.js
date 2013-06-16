goog.provide('jssip.sip.protocol.NameAddr');

goog.require('jssip.sip.protocol.ParsedParams');



/**
 * The name-addr defined in the SIP ABNF does not contain params as part of the
 * spec, however a name-addr is used together with contextual params throughout
 * the protocol.
 * @param {!jssip.uri.Uri} uri
 * @param {string=} opt_displayName
 * @param {!jssip.sip.protocol.ParsedParams=} opt_contextParams
 * @constructor
 */
jssip.sip.protocol.NameAddr =
    function(uri, opt_displayName, opt_contextParams) {
  /** @private {!jssip.uri.Uri} */
  this.uri_ = uri;

  /** @private {string} */
  this.displayName_ = opt_displayName || '';

  /** @private {!jssip.sip.protocol.ParsedParams} */
  this.contextParams_ = opt_contextParams ||
      new jssip.sip.protocol.ParsedParams([]);
};


/** @return {!jssip.uri.Uri} */
jssip.sip.protocol.NameAddr.prototype.getUri = function() {
  return this.uri_;
};


/** @return {string} */
jssip.sip.protocol.NameAddr.prototype.getDisplayName = function() {
  return this.displayName_;
};


/** @return {!jssip.sip.protocol.ParsedParams} */
jssip.sip.protocol.NameAddr.prototype.getContextParams = function() {
  return this.contextParams_;
};
