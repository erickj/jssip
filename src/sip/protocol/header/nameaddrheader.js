goog.provide('jssip.sip.protocol.header.NameAddrHeader');
goog.provide('jssip.sip.protocol.header.NameAddrHeaderParser');
goog.provide('jssip.sip.protocol.header.NameAddrHeaderParserFactory');

goog.require('goog.asserts');
goog.require('jssip.message.HeaderDecorator');
goog.require('jssip.message.WrappingHeaderParser');
goog.require('jssip.sip.protocol.NameAddr');



/**
 * @param {!jssip.message.HeaderParserFactory} wrappedHeaderParserFactory
 * @param {string} headerName
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.WrappingHeaderParserFactory}
 */
jssip.sip.protocol.header.NameAddrHeaderParserFactory =
    function(wrappedHeaderParserFactory, headerName, parserRegistry) {
  goog.base(this, wrappedHeaderParserFactory, headerName);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};
goog.inherits(jssip.sip.protocol.header.NameAddrHeaderParserFactory,
    jssip.message.WrappingHeaderParserFactory);


/** @override */
jssip.sip.protocol.header.NameAddrHeaderParserFactory.prototype.
    createParserInternal = function(wrappedParser) {
  return new jssip.sip.protocol.header.NameAddrHeaderParser(
      wrappedParser, this.parserRegistry_);
};



/**
 * @param {!jssip.message.HeaderParser} wrappedHeaderParser
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @extends {jssip.message.WrappingHeaderParser}
 */
jssip.sip.protocol.header.NameAddrHeaderParser =
    function(wrappedHeaderParser, parserRegistry) {
  goog.base(this, wrappedHeaderParser);

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};
goog.inherits(jssip.sip.protocol.header.NameAddrHeaderParser,
    jssip.message.WrappingHeaderParser);


/** @override */
jssip.sip.protocol.header.NameAddrHeaderParser.prototype.parseInternal =
    function(header) {
  var nameAddr = jssip.sip.protocol.header.NameAddrHeaderParser.
      convertToNameAddr(header.getParsedValue(), this.parserRegistry_);
  return new jssip.sip.protocol.header.NameAddrHeader(header, nameAddr);
};


/**
 * Converts a parsed name-addr or addr-spec plus params to a
 * {@code jssip.sip.protocol.NameAddr}.
 * @param {!Array} parsedValue
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.protocol.header.NameAddrHeaderParser.convertToNameAddr =
    function(parsedValue, parserRegistry) {
  goog.asserts.assert(goog.isArray(parsedValue) && parsedValue.length == 2);
  var rawNameAddrOrAddrSpec = parsedValue[0];
  var rawParams =  parsedValue[1];
  var contactParams = new jssip.sip.protocol.ParsedParams(rawParams);
  var rawUri;
  var displayName;
  if (goog.isString(rawNameAddrOrAddrSpec)) {
    rawUri = rawNameAddrOrAddrSpec
  } else {
    goog.asserts.assert(goog.isArray(rawNameAddrOrAddrSpec));
    displayName = rawNameAddrOrAddrSpec[0];
    rawUri = rawNameAddrOrAddrSpec[2];
  }
  return new jssip.sip.protocol.NameAddr(
      parserRegistry.parseUri(rawUri), displayName, contactParams);
};



/**
 * A header value with a single name-addr
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {!jssip.sip.protocol.NameAddr} nameAddr The name addr.
 * @extends {jssip.message.HeaderDecorator}
 * @constructor
 */
jssip.sip.protocol.header.NameAddrHeader = function(decoratedHeader, nameAddr) {
  goog.base(this, decoratedHeader);

  /** @private {!jssip.sip.protocol.NameAddr} */
  this.nameAddr_ = nameAddr;
};
goog.inherits(
    jssip.sip.protocol.header.NameAddrHeader, jssip.message.HeaderDecorator);


/** @return {!jssip.sip.protocol.NameAddr} */
jssip.sip.protocol.header.NameAddrHeader.prototype.getNameAddr = function() {
  return this.nameAddr_;
};
