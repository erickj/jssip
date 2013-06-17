goog.provide('jssip.sip.protocol.header.NameAddrHeader');

goog.require('jssip.sip.protocol.header.HeaderDecorator');
goog.require('jssip.sip.protocol.NameAddr');



/**
 * A header value with a single name-addr
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {!jssip.sip.protocol.NameAddr} nameAddr The name addr.
 * @extends {jssip.sip.protocol.header.HeaderDecorator}
 * @constructor
 */
jssip.sip.protocol.header.NameAddrHeader = function(decoratedHeader, nameAddr) {
  goog.base(this, decoratedHeader,
      jssip.sip.protocol.header.HeaderDecorator.Type.NAME_ADDR);

  /** @private {!jssip.sip.protocol.NameAddr} */
  this.nameAddr_ = nameAddr;
};
goog.inherits(jssip.sip.protocol.header.NameAddrHeader,
    jssip.sip.protocol.header.HeaderDecorator);


/** @return {!jssip.sip.protocol.NameAddr} */
jssip.sip.protocol.header.NameAddrHeader.prototype.getNameAddr = function() {
  return this.nameAddr_;
};
