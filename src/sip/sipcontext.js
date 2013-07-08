goog.provide('jssip.sip.SipContext');

goog.require('jssip.sip.protocol.storage.DialogStorage');


/**
 * Provides resources for SIP protocol specifics.
 * @param {!jssip.storage.Storage} backingStore Storage for all protocol
 *     storage containers.
 * @param {!Array.<!jssip.sip.protocol.Route>} preloadedRoutes
 * @constructor
 */
jssip.sip.SipContext = function(backingStore, preloadedRoutes) {
  /** @private {!jssip.sip.protocol.storage.DialogStorage} */
  this.dialogStorage_ =
      new jssip.sip.protocol.storage.DialogStorage(backingStore);

  /** @private {!Array.<!jssip.sip.protocol.Route>} */
  this.preloadedRoutes_ = preloadedRoutes;
};


/**
 * Gets the dialog storage for this application
 * @return {!jssip.sip.protocol.storage.DialogStorage}
 */
jssip.sip.SipContext.prototype.getDialogStorage = function() {
  return this.dialogStorage_;
};


/**
 * Gets the set of configured preloaded routes.
 * @return {!Array.<!jssip.sip.protocol.Route>}
 */
jssip.sip.SipContext.prototype.getPreloadedRoutes = function() {
  return this.preloadedRoutes_;
};


/**
 * Gets the contact for this SIP context.
 * @param {boolean} isSecure Whether this should be a secure contact.
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.SipContext.prototype.getContact = function(isSecure) {
  throw new Error('not implemented');
};
