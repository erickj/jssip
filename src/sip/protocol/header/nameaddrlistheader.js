goog.provide('jssip.sip.protocol.header.NameAddrListHeader');

goog.require('jssip.sip.protocol.header.HeaderDecorator');



/**
 * A header value with a single name-addr
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {!Array.<!jssip.sip.protocol.NameAddr>} nameAddrList The list of name
 *     addrs.
 * @extends {jssip.sip.protocol.header.HeaderDecorator}
 * @constructor
 */
jssip.sip.protocol.header.NameAddrListHeader =
    function(decoratedHeader, nameAddrList) {
  goog.base(this, decoratedHeader);

  /** @private {!Array.<!jssip.sip.protocol.NameAddr>} */
  this.nameAddrList_ = nameAddrList;
};
goog.inherits(jssip.sip.protocol.header.NameAddrListHeader,
    jssip.sip.protocol.header.HeaderDecorator);


/** @return {!Array.<!jssip.sip.protocol.NameAddr>} */
jssip.sip.protocol.header.NameAddrListHeader.prototype.getNameAddrList =
    function() {
  return this.nameAddrList_;
};
