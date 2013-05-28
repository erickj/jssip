goog.provide('jssip.message.BuilderMessageContext');

goog.require('jssip.message.MessageContext');



/**
 * @param {!jssip.message.Message.Builder} builder
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.MessageContext}
 */
jssip.message.BuilderMessageContext = function(builder, parserRegistry) {
  var propertyMap = {};
  propertyMap[
      jssip.message.BuilderMessageContext.PropertyName.BUILDER] = builder;
  goog.base(this,
      jssip.message.MessageContext.Type.BUILDER, propertyMap, parserRegistry);
};
goog.inherits(
    jssip.message.BuilderMessageContext, jssip.message.MessageContext);


/** @enum {string} */
jssip.message.BuilderMessageContext.PropertyName = {
  BUILDER: 'builder'
};


/**
 * @return {!jssip.message.Message.Builder} Message builder.
 */
jssip.message.BuilderMessageContext.prototype.getBuilder = function() {
  return /** @type {!jssip.message.Message.Builder} */ (
      this.getPropertyHolder().get(
          jssip.message.BuilderMessageContext.PropertyName.BUILDER));
};


/** @override */
jssip.message.BuilderMessageContext.prototype.getMessageInternal = function() {
  return this.getBuilder().build();
};
