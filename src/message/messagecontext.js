goog.provide('jssip.message.MessageContext');

goog.require('jssip.sip.protocol.RouteSet');
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
  MESSAGE: 'mc-message',
  ROUTESET: 'mc-routset',
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


// TODO(erick): Dialog work
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
 * Returns the message.  Lazily requests the message from
 * {@code getMessageInternal} on first access only.
 * @return {!jssip.message.Message} The message object.
 */
jssip.message.MessageContext.prototype.getMessage = function() {
  var message = this.propertyHolder_.get(
      jssip.message.MessageContext.PropertyName.MESSAGE);
  if (!message) {
    message = this.getMessageInternal();
    this.propertyHolder_.set(
        jssip.message.MessageContext.PropertyName.MESSAGE, message);
  }
  return /** @type {!jssip.message.Message} */ (message);
};


/**
 * Returns the route set for this message, or builds one if it does not exist.
 * @return {!jssip.sip.protocol.RouteSet} The route set.
 */
jssip.message.MessageContext.prototype.getRouteSet = function() {
  var routeSet = this.propertyHolder_.get(
      jssip.message.MessageContext.PropertyName.ROUTESET);
  if (!routeSet) {
    routeSet = jssip.sip.protocol.RouteSet.createFromMessageContext(this);
    this.propertyHolder_.set(
        jssip.message.MessageContext.PropertyName.ROUTESET, routeSet);
  }
  return /** @type {!jssip.sip.protocol.RouteSet} */ (routeSet);
};


/**
 * The protected getter for the message when it has not been set yet.
 * @return {!jssip.message.Message} The message object.
 * @protected
 */
jssip.message.MessageContext.prototype.getMessageInternal = goog.abstractMethod;
