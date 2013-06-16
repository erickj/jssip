goog.provide('jssip.sip.protocol.header.HeaderDecorator');

goog.require('jssip.message.Header');



/**
 * This class wraps a {@code jssip.message.Header} and delegates public method
 * calls to the decorated header.  This is meant to be used by subclasses to
 * decorate a parsed header with further capabilities.
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @constructor
 * @implements {jssip.message.Header}
 */
jssip.sip.protocol.header.HeaderDecorator = function(decoratedHeader) {
  /** @private {!jssip.message.Header} */
  this.decoratedHeader_ = decoratedHeader;
};


/** @override */
jssip.sip.protocol.header.HeaderDecorator.prototype.getHeaderName = function() {
  return this.decoratedHeader_.getHeaderName();
};


/** @override */
jssip.sip.protocol.header.HeaderDecorator.prototype.getRawValue = function() {
  return this.decoratedHeader_.getRawValue();
};


/** @override */
jssip.sip.protocol.header.HeaderDecorator.prototype.getParsedValue =
    function() {
  return this.decoratedHeader_.getParsedValue();
};
