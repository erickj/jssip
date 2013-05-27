goog.provide('jssip.message.MessageContext');

goog.require('jssip.core.PropertyHolder');



/**
 * @param {string} rawMessageText The raw message text.
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 */
jssip.message.MessageContext = function(rawMessageText, parserRegistry) {
  var propertyMap = {};
  propertyMap[jssip.message.MessageContext.PropertyName.RAWMESSAGE] =
      rawMessageText;

  /** @private {!jssip.core.PropertyHolder} */
  this.propertyHolder_ =
      new jssip.core.PropertyHolder(propertyMap, false /* opt_isImmutable */);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/** @enum {string} */
jssip.message.MessageContext.PropertyName = {
  MESSAGE: 'message',
  RAWMESSAGE: 'rawmessage'
};


/**
 * Returns the raw message text.
 * @return {string} Message text.
 */
jssip.message.MessageContext.prototype.getRawMessageText = function() {
  return /** @type {string} */ (this.propertyHolder_.get(
      jssip.message.MessageContext.PropertyName.RAWMESSAGE));
};


/**
 * Returns the message.
 * @return {!jssip.message.Message} The message object.
 */
jssip.message.MessageContext.prototype.getMessage = function() {
  var message = /** @type {!jssip.message.Message} */ (this.propertyHolder_.get(
      jssip.message.MessageContext.PropertyName.MESSAGE));
  if (!message) {
    message = this.parserRegistry_.parseMessage(this.getRawMessageText());
    this.propertyHolder_.set(
        jssip.message.MessageContext.PropertyName.MESSAGE, message);
  }
  return message;
};
