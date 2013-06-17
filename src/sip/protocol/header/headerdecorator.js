goog.provide('jssip.sip.protocol.header.HeaderDecorator');

goog.require('jssip.message.Header');



/**
 * This class wraps a {@code jssip.message.Header} and delegates public method
 * calls to the decorated header.  This is meant to be used by subclasses to
 * decorate a parsed header with further capabilities.
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {jssip.sip.protocol.header.HeaderDecorator.Type} type
 * @constructor
 * @implements {jssip.message.Header}
 */
jssip.sip.protocol.header.HeaderDecorator = function(decoratedHeader, type) {
  /** @private {!jssip.message.Header} */
  this.decoratedHeader_ = decoratedHeader;

  /** @private {jssip.sip.protocol.header.HeaderDecorator.Type} */
  this.type_ = type;
};


/** @enum {string} */
jssip.sip.protocol.header.HeaderDecorator.Type = {
  NAME_ADDR: 'hdrdec-name-addr',
  NAME_ADDR_LIST: 'hdrdec-name-addr-list'
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


/** @return {jssip.sip.protocol.header.HeaderDecorator.Type} */
jssip.sip.protocol.header.HeaderDecorator.prototype.getType = function() {
  return this.type_;
};
