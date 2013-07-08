goog.provide('jssip.sip.protocol.NameAddr');

goog.require('jssip.sip.protocol.ParsedParams');



/**
 * The name-addr defined in the SIP ABNF does not contain params as part of the
 * spec, however a name-addr is used together with contextual params throughout
 * the protocol.
 * @param {!jssip.uri.Uri} uri
 * @param {string=} opt_displayName
 * @param {!jssip.sip.protocol.ParsedParams=} opt_contextParams
 * @param {boolean=} opt_forceNameAddr Whether to force treating this
 *     as a NameAddr if it would normally look like an addr-spec
 * @constructor
 */
jssip.sip.protocol.NameAddr =
    function(uri, opt_displayName, opt_contextParams, opt_forceNameAddr) {
  /** @private {!jssip.uri.Uri} */
  this.uri_ = uri;

  /** @private {string} */
  this.displayName_ = opt_displayName || '';

  /** @private {!jssip.sip.protocol.ParsedParams} */
  this.contextParams_ = opt_contextParams ||
      new jssip.sip.protocol.ParsedParams([]);

  /** @private {boolean} */
  this.forceNameAddr_ = !!opt_forceNameAddr;
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


/** @return {string} */
jssip.sip.protocol.NameAddr.prototype.stringify = function() {
  return this.isAddrSpec_() ?
      this.stringifyAsAddrSpec() :
      this.stringifyAsNameAddr();
};


/**
 * @return {boolean}
 * @private
 */
jssip.sip.protocol.NameAddr.prototype.isAddrSpec_ = function() {
  return !this.displayName_ && !this.uri_.hasParameters() &&
      !this.forceNameAddr_;
};


/** @return {string} */
jssip.sip.protocol.NameAddr.prototype.stringifyAsNameAddr = function() {
  var str = '';
  if (this.displayName_) {
    str += '"' + this.displayName_ + '" ';
  }
  return str + '<' + this.uri_.stringify() + '>' +
      this.contextParams_.stringify();
};


/** @return {string} */
jssip.sip.protocol.NameAddr.prototype.stringifyAsAddrSpec = function() {
  return this.uri_.stringify() + this.contextParams_.stringify();
};


/**
 * Clones this NameAddr into a new name addr and augments the context
 * parameters with the given additional parameter map.
 * @param {!Object.<string|boolean>} addlParams
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.protocol.NameAddr.prototype.cloneWithAdditionalParameters =
    function(addlParams) {
  var paramMap = this.getContextParams().getParametersAsObject();
  goog.mixin(paramMap, addlParams);
  return new jssip.sip.protocol.NameAddr(this.getUri(), this.getDisplayName(),
      jssip.sip.protocol.ParsedParams.createFromParameterMap(paramMap));
};
