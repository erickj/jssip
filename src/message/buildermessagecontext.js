goog.provide('jssip.message.BuilderMessageContext');

goog.require('jssip.message.MessageContext');



/**
 * @param {!jssip.message.Message.Builder} builder
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.MessageContext}
 */
jssip.message.BuilderMessageContext = function(builder, parserRegistry) {
  goog.base(this, jssip.message.MessageContext.Type.BUILDER, parserRegistry);

  /** @private {!jssip.message.Message.Builder} */
  this.builder_ = builder;
};
goog.inherits(
    jssip.message.BuilderMessageContext, jssip.message.MessageContext);


/**
 * @return {!jssip.message.Message.Builder} Message builder.
 */
jssip.message.BuilderMessageContext.prototype.getBuilder = function() {
  return this.builder_;
};


/** @override */
jssip.message.BuilderMessageContext.prototype.getMessageInternal = function() {
  return this.getBuilder().build();
};
