goog.provide('jssip.sip.SipContext');

goog.require('jssip.sip.protocol.storage.DialogStorage');


/**
 * Provides resources for SIP protocol specifics.
 * @param {!jssip.storage.Storage} backingStore Storage for all protocol
 *     storage containers.
 * @constructor
 */
jssip.sip.SipContext = function(backingStore) {
  /** @private {!jssip.sip.protocol.storage.DialogStorage} */
  this.dialogStorage_ =
      new jssip.sip.protocol.storage.DialogStorage(backingStore);
};


/**
 * Gets the dialog storage for this application
 * @return {!jssip.sip.protocol.storage.DialogStorage}
 */
jssip.sip.SipContext.prototype.getDialogStorage = function() {
  return this.dialogStorage_;
};
