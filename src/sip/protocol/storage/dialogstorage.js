goog.provide('jssip.sip.protocol.storage.DialogStorage');

goog.require('goog.string');
goog.require('jssip.sip.protocol.header.NameAddrHeader');
goog.require('jssip.sip.protocol.rfc3261');



/**
 * A storage layer for SIP dialogs.
 *
 * @param {!jssip.storage.Storage} backingStore The backing storage
 *     implementation where the bits will actually be kept.
 * @constructor
 */
jssip.sip.protocol.storage.DialogStorage = function(backingStore) {
  /** @type {!jssip.storage.Storage} */
  this.backingStore_ = backingStore;
};


/**
 * Gets a dialog for a message if one exists in storage.
 * @param {!jssip.message.MessageContext} messageContext
 * @param {boolean} isLocal Whether this is a locally originated message
 *     context.
 * @return {jssip.sip.protocol.Dialog} The dialog for the message or null if not
 *     found.
 */
jssip.sip.protocol.storage.DialogStorage.prototype.getDialogForMessageContext =
    function(messageContext, isLocal) {
  var dialogKey = jssip.sip.protocol.storage.DialogStorage.Key_.
      createForMessageContext(messageContext, isLocal);
  return /** @type {!jssip.sip.protocol.Dialog} */ (
      this.backingStore_.get(dialogKey.value)) || null;
};


/**
 * Sets or updates a dialog in storage.
 *
 * @param {!jssip.sip.protocol.Dialog} dialog
 */
jssip.sip.protocol.storage.DialogStorage.prototype.setDialog =
    function(dialog) {
  var dialogKey = jssip.sip.protocol.storage.DialogStorage.Key_.
      createForDialog(dialog);
  this.backingStore_.set(dialogKey.value, dialog);
};


/**
 * Removes a dialog from storage.
 *
 * @param {!jssip.sip.protocol.Dialog} dialog
 */
jssip.sip.protocol.storage.DialogStorage.prototype.removeDialog =
    function(dialog) {
  var dialogKey = jssip.sip.protocol.storage.DialogStorage.Key_.
      createForDialog(dialog);
  this.backingStore_.remove(dialogKey.value);
};



/**
 * @param {string} callId
 * @param {string} localTag
 * @param {string} remoteTag
 * @constructor
 * @private
 */
jssip.sip.protocol.storage.DialogStorage.Key_ =
    function(callId, localTag, remoteTag) {
  var prefix = 'dlg:';
  this.value = prefix + [callId, localTag, remoteTag].join('//');
};


/**
 * Creates a key from a dialog.
 * @param {!jssip.sip.protocol.Dialog} dialog
 * @return {!jssip.sip.protocol.storage.DialogStorage.Key_}
 */
jssip.sip.protocol.storage.DialogStorage.Key_.createForDialog =
    function(dialog) {
  return new jssip.sip.protocol.storage.DialogStorage.Key_(
      dialog.getCallId(), dialog.getLocalTag(), dialog.getRemoteTag());
};


/**
 * Creates a key from a message context.
 * @param {!jssip.message.MessageContext} messageContext
 * @param {boolean} isLocal
 * @return {!jssip.sip.protocol.storage.DialogStorage.Key_}
 */
jssip.sip.protocol.storage.DialogStorage.Key_.createForMessageContext =
    function(messageContext, isLocal) {
  var callIdHeader = messageContext.getParsedHeader(
      jssip.sip.protocol.rfc3261.HeaderType.CALL_ID)[0];
  var toHeader = messageContext.getParsedHeader(
      jssip.sip.protocol.rfc3261.HeaderType.TO)[0];
  var fromHeader = messageContext.getParsedHeader(
      jssip.sip.protocol.rfc3261.HeaderType.FROM)[0];
  if (!(toHeader instanceof jssip.sip.protocol.header.NameAddrHeader) ||
      !(fromHeader instanceof jssip.sip.protocol.header.NameAddrHeader)) {
    throw new Error('Expected NameAddrHeader');
  }

  var callId = callIdHeader.getParsedValue()[0];
  goog.asserts.assert(goog.isString(callId) && callId.length > 0);

  var tagParam = 'tag';
  var toTag = /** @type {!jssip.sip.protocol.header.NameAddrHeader} */ (
      toHeader).getNameAddr().getContextParams().getParameter(tagParam) || '';
  var fromTag = /** @type {!jssip.sip.protocol.header.NameAddrHeader} */ (
      fromHeader).getNameAddr().getContextParams().getParameter(tagParam) || '';
  goog.asserts.assert(goog.isString(toTag) && goog.isString(fromTag));

  var localTag;
  var remoteTag;
  if (messageContext.isRequest()) {
    localTag = isLocal ? fromTag : toTag;
    remoteTag = isLocal ? toTag : fromTag;
  } else {
    localTag = isLocal ? toTag : fromTag;
    remoteTag = isLocal ? fromTag : toTag;
  }

  return new jssip.sip.protocol.storage.DialogStorage.Key_(
      callId, localTag, remoteTag);
};
