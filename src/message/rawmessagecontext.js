goog.provide('jssip.message.RawMessageContext');

goog.require('jssip.message.MessageContext');



/**
 * @param {string} rawMessageText The raw message text.
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.MessageContext}
 */
jssip.message.RawMessageContext = function(rawMessageText, parserRegistry) {
  var propertyMap = {};
  propertyMap[jssip.message.MessageContext.PropertyName.RAWMESSAGE] =
      rawMessageText;
  goog.base(
      this, jssip.message.MessageContext.Type.RAW, propertyMap, parserRegistry);
};
goog.inherits(jssip.message.RawMessageContext, jssip.message.MessageContext);


/** @enum {string} */
jssip.message.RawMessageContext.PropertyName = {
  RAWMESSAGE: 'rawmessage'
};


/**
 * Returns the raw message text.
 * @return {string} Message text.
 */
jssip.message.RawMessageContext.prototype.getRawMessageText = function() {
  return /** @type {string} */ (this.getPropertyHolder().get(
      jssip.message.MessageContext.PropertyName.RAWMESSAGE));
};


/** @override */
jssip.message.RawMessageContext.prototype.getMessageInternal = function() {
  return this.getParserRegistry().parseMessage(this.getRawMessageText());
};
