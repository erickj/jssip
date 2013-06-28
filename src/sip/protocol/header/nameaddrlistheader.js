goog.provide('jssip.sip.protocol.header.NameAddrListHeader');
goog.provide('jssip.sip.protocol.header.NameAddrListHeaderParserFactory');

goog.require('jssip.message.HeaderDecorator');
goog.require('jssip.message.WrappingHeaderParser');
goog.require('jssip.sip.protocol.header.NameAddrHeaderParser');



/**
 * @param {!jssip.message.HeaderParserFactory} wrappedHeaderParserFactory
 * @param {string} headerName
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.WrappingHeaderParserFactory}
 */
jssip.sip.protocol.header.NameAddrListHeaderParserFactory =
    function(wrappedHeaderParserFactory, headerName, parserRegistry) {
  goog.base(this, wrappedHeaderParserFactory, headerName);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};
goog.inherits(jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
    jssip.message.WrappingHeaderParserFactory);


/** @override */
jssip.sip.protocol.header.NameAddrListHeaderParserFactory.prototype.
    createParserInternal = function(wrappedParser) {
  return new jssip.sip.protocol.header.NameAddrListHeaderParser_(
      wrappedParser, this.parserRegistry_);
};



/**
 * @param {!jssip.message.HeaderParser} wrappedHeaderParser
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.WrappingHeaderParser}
 * @private
 */
jssip.sip.protocol.header.NameAddrListHeaderParser_ =
    function(wrappedHeaderParser, parserRegistry) {
  goog.base(this, wrappedHeaderParser);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};
goog.inherits(jssip.sip.protocol.header.NameAddrListHeaderParser_,
    jssip.message.WrappingHeaderParser);


/** @override */
jssip.sip.protocol.header.NameAddrListHeaderParser_.prototype.parseInternal =
    function(header) {
  var parsedContactValues = header.getParsedValue();
  var primaryContactValue = parsedContactValues[0];
  var commaDelimitedAddlContactValues = parsedContactValues[1]
  var convertFn =
      jssip.sip.protocol.header.NameAddrHeaderParser.convertToNameAddr;
  var nameAddrs = [convertFn(primaryContactValue, this.parserRegistry_)];

  // Parse addl name-addrs
  for (var i = 0; i < commaDelimitedAddlContactValues.length; i++) {
    // The comma "," is at index 0, the parsed value at index 1
    nameAddrs.push(
        convertFn(commaDelimitedAddlContactValues[i][1], this.parserRegistry_));
  }

  return new jssip.sip.protocol.header.NameAddrListHeader(header, nameAddrs);
};



/**
 * A header value with a single name-addr
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {!Array.<!jssip.sip.protocol.NameAddr>} nameAddrList The list of name
 *     addrs.
 * @extends {jssip.message.HeaderDecorator}
 * @constructor
 */
jssip.sip.protocol.header.NameAddrListHeader =
    function(decoratedHeader, nameAddrList) {
  goog.base(this, decoratedHeader);

  /** @private {!Array.<!jssip.sip.protocol.NameAddr>} */
  this.nameAddrList_ = nameAddrList;
};
goog.inherits(jssip.sip.protocol.header.NameAddrListHeader,
    jssip.message.HeaderDecorator);


/** @return {!Array.<!jssip.sip.protocol.NameAddr>} */
jssip.sip.protocol.header.NameAddrListHeader.prototype.getNameAddrList =
    function() {
  return this.nameAddrList_;
};
