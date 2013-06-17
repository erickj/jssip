goog.provide('jssip.message.MessageContext');

goog.require('jssip.sip.protocol.RouteSet');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.util.PropertyHolder');



/**
 * @param {jssip.message.MessageContext.Type} type
 * @param {!Object} propertyMap
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 */
jssip.message.MessageContext = function(type, propertyMap, parserRegistry) {
  propertyMap[jssip.message.MessageContext.PropertyName.TYPE] = type;

  /** @private {!jssip.util.PropertyHolder} */
  this.propertyHolder_ =
      new jssip.util.PropertyHolder(propertyMap, false /* opt_isImmutable */);

  /** @private {jssip.message.Message} */
  this.cachedMessage_ = null;

  /** @private {!Object.<!Array.<!jssip.message.Header>>} */
  this.parsedHeaderCache_ = {};

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/** @enum {string} */
jssip.message.MessageContext.Type = {
  RAW: 'raw',
  BUILDER: 'builder'
};


/** @enum {string} */
jssip.message.MessageContext.PropertyName = {
  DIALOG: 'mc-dialog',
  TRANSACTION: 'mc-transaction',
  TYPE: 'mc-type'
};


/**
 * @return {!jssip.parser.ParserRegistry}
 * @protected
 */
jssip.message.MessageContext.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/**
 * @return {!jssip.util.PropertyHolder}
 * @protected
 */
jssip.message.MessageContext.prototype.getPropertyHolder = function() {
  return this.propertyHolder_;
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
 * Returns the route set for this message, or builds one if it does not exist.
 * @return {!jssip.sip.protocol.RouteSet} The route set.
 */
jssip.message.MessageContext.prototype.getRouteSet = function() {
  throw Error('Not implemented yet');
};


/**
 * Returns the parsed value of the header in the message.
 * @param {string} headerName
 * @return {!Array.<!jssip.message.Header>}
 * @private
 */
jssip.message.MessageContext.prototype.getParsedHeader_ = function(headerName) {
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
