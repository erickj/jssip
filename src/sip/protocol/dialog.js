goog.provide('jssip.sip.protocol.Dialog');

goog.require('jssip.sip.protocol.rfc3261');



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
 * @param {number} sequenceNumber
 * @param {!jssip.uri.Uri} localUri
 * @param {!jssip.uri.Uri} remoteUri
 * @param {!jssip.uri.Uri} remoteTarget
 * @param {boolean} isSecure
 * @param {!jssip.sip.protocol.RouteSet} routeSet
 * @param {jssip.sip.protocol.Dialog.State} state
 * @constructor
 */
jssip.sip.protocol.Dialog = function(callId, remoteTag, localTag,
    sequenceNumber, localUri, remoteUri, remoteTarget, isSecure, routeSet,
    state) {
  /** @private {string} */
  this.callId_ = callId;

  /** @private {string} */
  this.remoteTag_ = remoteTag;

  /** @private {string} */
  this.localTag_ = localTag;

  /** @private {number} */
  this.sequenceNumber_ = sequenceNumber;

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
jssip.sip.protocol.Dialog.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
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


/** @return {boolean} */
jssip.sip.protocol.Dialog.prototype.isOutOfDialog = function() {
  return false;
}
