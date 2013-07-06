goog.provide('jssip.message.RawMessageContext');

goog.require('jssip.message.MessageContext');



/**
 * @param {string} rawMessageText The raw message text.
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @param {!jssip.sip.SipContext} sipContext
 * @constructor
 * @extends {jssip.message.MessageContext}
 */
jssip.message.RawMessageContext =
    function(rawMessageText, parserRegistry, sipContext) {
  goog.base(
      this, jssip.message.MessageContext.Type.RAW, parserRegistry, sipContext);

  /** @private {string} */
  this.rawMessageText_ = rawMessageText;
};
goog.inherits(jssip.message.RawMessageContext, jssip.message.MessageContext);


/**
 * Returns the raw message text.
 * @return {string} Message text.
 */
jssip.message.RawMessageContext.prototype.getRawMessageText = function() {
  return this.rawMessageText_;
};


/** @override */
jssip.message.RawMessageContext.prototype.getMessageInternal = function() {
  return this.getParserRegistry().parseMessage(this.getRawMessageText());
};
