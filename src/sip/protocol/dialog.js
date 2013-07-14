goog.provide('jssip.sip.protocol.Dialog');

goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.util.Serializable');



/**
 * A dialog represents a peer-to-peer SIP relationship between two user agents
 * that persists for some time.  The dialog facilitates sequencing of messages
 * between the user agents and proper routing of requests between both of them.
 * The dialog represents a context in which to interpret SIP messages.
 * @see http://tools.ietf.org/html/rfc3261#section-12
 *
 * @param {string} callId
 * @param {string} remoteTag
 * @param {string} localTag
 * @param {number} localSequenceNumber
 * @param {number} remoteSequenceNumber
 * @param {!jssip.uri.Uri} localUri
 * @param {!jssip.uri.Uri} remoteUri
 * @param {!jssip.uri.Uri} remoteTarget
 * @param {boolean} isSecure
 * @param {!jssip.sip.protocol.RouteSet} routeSet
 * @param {jssip.sip.protocol.Dialog.State} state
 * @constructor
 * @implements {jssip.util.Serializable}
 */
jssip.sip.protocol.Dialog = function(callId, remoteTag, localTag,
    localSequenceNumber, remoteSequenceNumber, localUri, remoteUri,
    remoteTarget, isSecure, routeSet, state) {
  /** @private {string} */
  this.callId_ = callId;

  /** @private {string} */
  this.remoteTag_ = remoteTag;

  /** @private {string} */
  this.localTag_ = localTag;

  /** @private {number} */
  this.localSequenceNumber_ = localSequenceNumber;

  /** @private {number} */
  this.remoteSequenceNumber_ = remoteSequenceNumber;

  /** @private {!jssip.uri.Uri} */
  this.localUri_ = localUri;

  /** @private {!jssip.uri.Uri} */
  this.remoteUri_ = remoteUri;

  /** @private {!jssip.uri.Uri} */
  this.remoteTarget_ = remoteTarget;

  /** @private {boolean} */
  this.isSecure_ = isSecure;

  /** @private {!jssip.sip.protocol.RouteSet} */
  this.routeSet_ = routeSet;

  /** @private {jssip.sip.protocol.Dialog.State} */
  this.state_ = state;
};


/** @enum {string} */
jssip.sip.protocol.Dialog.State = {
  EARLY: 'early',
  CONFIRMED: 'confirmed',
  TERMINATED: 'terminated'
};


/** @return {string} */
jssip.sip.protocol.Dialog.prototype.getCallId = function() {
  return this.callId_;
};


/** @return {string} */
jssip.sip.protocol.Dialog.prototype.getRemoteTag = function() {
  return this.remoteTag_;
};


/** @return {string} */
jssip.sip.protocol.Dialog.prototype.getLocalTag = function() {
  return this.localTag_;
};


/** @return {number} */
jssip.sip.protocol.Dialog.prototype.getLocalSequenceNumber = function() {
  return this.localSequenceNumber_;
};


/** @return {number} */
jssip.sip.protocol.Dialog.prototype.getRemoteSequenceNumber = function() {
  return this.remoteSequenceNumber_;
};


/** @return {!jssip.uri.Uri} */
jssip.sip.protocol.Dialog.prototype.getLocalUri = function() {
  return this.localUri_;
};


/** @return {!jssip.uri.Uri} */
jssip.sip.protocol.Dialog.prototype.getRemoteUri = function() {
  return this.remoteUri_;
};


/** @return {!jssip.uri.Uri} */
jssip.sip.protocol.Dialog.prototype.getRemoteTarget = function() {
  return this.remoteTarget_;
};


/** @return {boolean} */
jssip.sip.protocol.Dialog.prototype.getIsSecure = function() {
  return this.isSecure_;
};


/** @return {!jssip.sip.protocol.RouteSet} */
jssip.sip.protocol.Dialog.prototype.getRouteSet = function() {
  return this.routeSet_;
};


/** @return {jssip.sip.protocol.Dialog.State} */
jssip.sip.protocol.Dialog.prototype.getState = function() {
  return this.state_;
};


/**
 * Gets a name-addr for use in a To header. {@code isRequest} indicates whether
 * this is for a request or response message.
 * @param {isRequest} boolean
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.protocol.Dialog.prototype.getToNameAddr = function(isRequest) {
  var uri = isRequest ? this.getRemoteUri() : this.getLocalUri();
  var tag = isRequest ? this.getRemoteTag() : this.getLocalTag();
  return new jssip.sip.protocol.NameAddr(uri, undefined /* displayName */,
      jssip.sip.protocol.ParsedParams.createFromParameterMap({tag: tag}),
      true /* opt_forceNameAddr */);
};


/**
 * Gets a name-addr for use in a From header. {@code isRequest} indicates
 * whether this is for a request or response message.
 * @param {isRequest} boolean
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.protocol.Dialog.prototype.getFromNameAddr = function(isRequest) {
  var uri = isRequest ? this.getLocalUri() : this.getRemoteUri();
  var tag = isRequest ? this.getLocalTag() : this.getRemoteTag();
  return new jssip.sip.protocol.NameAddr(uri, undefined /* displayName */,
      jssip.sip.protocol.ParsedParams.createFromParameterMap({tag: tag}),
      true /* opt_forceNameAddr */);
};


// TODO: The serializable methods are unimplemented for now.  Need to implement
// once a storage implmentation is in place that will actually call them.
/** @override */
jssip.sip.protocol.Dialog.prototype.serialize = function() {
  throw new Error('Not implemented');
};


/** @override */
jssip.sip.protocol.Dialog.prototype.getSerializedType = function() {
  throw new Error('Not implemented');
};
