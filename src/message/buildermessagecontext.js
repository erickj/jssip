goog.provide('jssip.message.BuilderMessageContext');

goog.require('jssip.message.MessageContext');



/**
 * A message context for building local messages.  A builder message context
 * must always return true for {@code #isLocal}.
 *
 * @param {!jssip.message.Message.Builder} builder
 * @param {boolean} isStrictRouting
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @param {!jssip.sip.SipContext} sipContext
 * @constructor
 * @extends {jssip.message.MessageContext}
 */
jssip.message.BuilderMessageContext =
    function(builder, isStrictRouting, parserRegistry, sipContext) {
  goog.base(this,
      jssip.message.MessageContext.Type.BUILDER, parserRegistry, sipContext);

  /** @private {!jssip.message.Message.Builder} */
  this.builder_ = builder;

  /** @private {boolean} */
  this.isStrictRouting_ = isStrictRouting;
};
goog.inherits(
    jssip.message.BuilderMessageContext, jssip.message.MessageContext);


/** @override */
jssip.message.BuilderMessageContext.prototype.getMessageInternal = function() {
  return this.builder_.build();
};


/** @override */
jssip.message.BuilderMessageContext.prototype.isLocal = function() {
  return true;
};


/** @override */
jssip.message.BuilderMessageContext.prototype.setHeaderInternal =
    function(key, value, opt_overwrite) {
  this.builder_.setHeader(key, value, opt_overwrite);
};


/** @override */
jssip.message.BuilderMessageContext.prototype.isStrictRouting = function() {
  return this.isStrictRouting_;
};
