goog.provide('jssip.message.MessageContext');


/**
 * A container for passing messages through the SIP stack.
 * @param {string} rawMessageText The raw message text.
 * @param {!jssip.message.Message} message The message object.
 * @param {!jssip.Parser} parser The parser instance to be used to handle
 *     further message, header, and URI parsing.
 * @constructor
 */
jssip.message.MessageContext = function(rawMessageText, message, parser) {
  /**
   * @type {string}
   * @private
   */
  this.rawMessageText_ = messageText;

  /**
   * @type {!jssip.message.Message}
   * @private
   */
  this.message_ = message;

  /**
   * @type {!jssip.Parser}
   * @private
   */
  this.parser_ = parser;
};


/**
 * Returns the raw message text.
 * @return {string} Message text.
 */
jssip.message.MessageContext.prototype.getRawMessageText = function() {
  return this.rawMessageText_;
};
