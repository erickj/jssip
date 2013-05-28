goog.provide('jssip.message.MessageContext');

goog.require('jssip.core.PropertyHolder');



/**
 * @param {jssip.message.MessageContext.Type} type
 * @param {!Object} propertyMap
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 */
jssip.message.MessageContext = function(type, propertyMap, parserRegistry) {
  propertyMap[jssip.message.MessageContext.PropertyName.TYPE] = type;

  /** @private {!jssip.core.PropertyHolder} */
  this.propertyHolder_ =
      new jssip.core.PropertyHolder(propertyMap, false /* opt_isImmutable */);

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
  MESSAGE: 'message',
  TYPE: 'type'
};


/**
 * @return {!jssip.parser.ParserRegistry}
 * @protected
 */
jssip.message.MessageContext.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/**
 * Returns the message.
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
 * The protected getter for the message when it has not been set yet.
 * @return {!jssip.message.Message} The message object.
 * @protected
 */
jssip.message.MessageContext.prototype.getMessageInternal = goog.abstractMethod;
