goog.provide('jssip.message.MessageContext');



/**
 * @param {jssip.message.MessageContext.Type} type
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @param {!jssip.sip.SipContext} sipContext
 * @constructor
 */
jssip.message.MessageContext = function(type, parserRegistry, sipContext) {
  /** @private {jssip.message.MessageContext.Type} */
  this.type_ = type;

  /** @private {jssip.message.Message} */
  this.cachedMessage_ = null;

  /** @private {!Object.<!Array.<!jssip.message.Header>>} */
  this.parsedHeaderCache_ = {};

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;

  /** @private {!jssip.sip.SipContext} */
  this.sipContext_ = sipContext;
};


/** @enum {string} */
jssip.message.MessageContext.Type = {
  RAW: 'raw',
  BUILDER: 'builder'
};


/**
 * @return {!jssip.parser.ParserRegistry}
 * @protected
 */
jssip.message.MessageContext.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/**
 * The protected getter for the message when it has not been set yet.
 * @return {!jssip.message.Message} The message object.
 * @protected
 */
jssip.message.MessageContext.prototype.getMessageInternal = goog.abstractMethod;


/**
 * Returns the message.  Lazily requests the message from
 * {@code getMessageInternal} on first access only.
 * @return {!jssip.message.Message} The message object.
 */
jssip.message.MessageContext.prototype.getMessage = function() {
  if (!this.cachedMessage_) {
    this.cachedMessage_ = this.getMessageInternal();
  }
  return this.cachedMessage_;
};


/**
 * @return {boolean} Whether or not this is a message context for a request.
 */
jssip.message.MessageContext.prototype.isRequest = function() {
  return this.getMessage().isRequest();
};


/**
 * Returns the dialog associated with this message.
 * @return {!jssip.sip.protocol.Dialog} The dialog.
 */
jssip.message.MessageContext.prototype.getDialog = function() {
  throw Error('Not implemented yet');
};


/**
 * Returns the transaction associated with this message.
 * @return {!jssip.sip.protocol.Transaction} The transaction.
 */
jssip.message.MessageContext.prototype.getTransaction = function() {
  throw Error('Not implemented yet');
};


/**
 * Returns the parsed value of the header in the message.
 * @param {string} headerName
 * @return {!Array.<!jssip.message.Header>}
 */
jssip.message.MessageContext.prototype.getParsedHeader = function(headerName) {
  if (!goog.isDef(this.parsedHeaderCache_[headerName])) {
    var message = this.getMessage();
    var headerValues = message.getHeaderValue(headerName);
    var parsedHeaderValues = [];
    if (headerValues != null) {
      for (var i = 0; i < headerValues.length; i++) {
        parsedHeaderValues.push(
            this.parserRegistry_.parseHeader(headerName, headerValues[i]));
      }
    }
    this.parsedHeaderCache_[headerName] = parsedHeaderValues;
  }
  return this.parsedHeaderCache_[headerName];
};
