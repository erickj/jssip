goog.provide('jssip.sip.plugin.core.header.ContactHeader');
goog.provide('jssip.sip.plugin.core.header.ContactHeaderParserFactory');

goog.require('goog.asserts');
goog.require('jssip.message.HeaderParser');
goog.require('jssip.message.HeaderParserFactory');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.header.NameAddrListHeader');
goog.require('jssip.sip.protocol.rfc3261');



/**
 * @param {!jssip.message.HeaderParserFactory} headerParserFactory
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 */
jssip.sip.plugin.core.header.ContactHeaderParserFactory =
    function(headerParserFactory, parserRegistry) {
  /** @private {!jssip.message.HeaderParserFactory} */
  this.headerParserFactory_ = headerParserFactory;

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/**
 * @override
 * @param {string} headerValue
 * @return {!jssip.message.HeaderParser}
 */
jssip.sip.plugin.core.header.ContactHeaderParserFactory.prototype.createParser =
    function(headerValue) {
  var parser = this.headerParserFactory_.createParser(headerValue);
  parser.initializeHeaderName(jssip.sip.protocol.rfc3261.HeaderType.CONTACT);
  return new jssip.sip.plugin.core.header.ContactHeaderParser_(
      parser, this.parserRegistry_);
};



/**
 * @param {!jssip.message.HeaderParser} headerParser
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 * @implements {jssip.message.HeaderParser}
 * @private
 */
jssip.sip.plugin.core.header.ContactHeaderParser_ =
    function(headerParser, parserRegistry) {
  /** @private {!jssip.message.HeaderParser} */
  this.headerParser_ = headerParser;

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/** @override */
jssip.sip.plugin.core.header.ContactHeaderParser_.prototype.
    initializeHeaderName = goog.nullFunction;


/**
 * @override
 * @return {!jssip.sip.plugin.core.header.ContactHeader}
 */
jssip.sip.plugin.core.header.ContactHeaderParser_.prototype.parse = function() {
  var header = this.headerParser_.parse();
  var parsedContactValues = header.getParsedValue();
  var nameAddrs = [this.convertToNameAddr_(parsedContactValues[0])];

  // Parse addl name-addrs
  for (var i = 0; i < parsedContactValues[1].length; i++) {
    nameAddrs.push(this.convertToNameAddr_(parsedContactValues[1][i]));
  }

  return new jssip.sip.plugin.core.header.ContactHeader(header, nameAddrs);
};


/**
 * @param {!Array} parsedValue
 * @return {!jssip.sip.protocol.NameAddr}
 * @private
 */
jssip.sip.plugin.core.header.ContactHeaderParser_.prototype.
    convertToNameAddr_ = function(parsedValue) {
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
      this.parserRegistry_.parseUri(rawUri), displayName, contactParams);
};




/**
 * @param {!jssip.message.Header} header
 * @param {!Array.<!jssip.sip.protocol.NameAddr>} nameAddrs
 * @constructor
 * @extends {jssip.sip.protocol.header.NameAddrListHeader}
 */
jssip.sip.plugin.core.header.ContactHeader = function(header, nameAddrs) {
  goog.base(this, header, nameAddrs);
};
goog.inherits(jssip.sip.plugin.core.header.ContactHeader,
    jssip.sip.protocol.header.NameAddrListHeader);
