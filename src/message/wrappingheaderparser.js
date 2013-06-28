goog.provide('jssip.message.WrappingHeaderParser');
goog.provide('jssip.message.WrappingHeaderParserFactory');

goog.require('jssip.message.HeaderParser');
goog.require('jssip.message.HeaderParserFactory');


/**
 * Wraps a header parser factory.  This class is meant to be subclassed and used
 * to generate decorated headers.
 * @param {!jssip.message.HeaderParserFactory} wrappedHeaderParserFactory
 * @param {string} headerName
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 */
jssip.message.WrappingHeaderParserFactory =
    function(wrappedHeaderParserFactory, headerName) {
  /** @private {!jssip.message.HeaderParserFactory} */
  this.wrappedHeaderParserFactory_ = wrappedHeaderParserFactory;

  /** @private {string} */
  this.headerName_ = headerName;
};


/** @override */
jssip.message.WrappingHeaderParserFactory.prototype.createParser =
    function(headerValue) {
  var wrappedParser =
      this.wrappedHeaderParserFactory_.createParser(headerValue);
  wrappedParser.initializeHeaderName(this.headerName_);
  return this.createParserInternal(wrappedParser);
};


/**
 * @param {!jssip.message.HeaderParser} wrappedParser
 * @return {!jssip.message.HeaderParser}
 * @protected
 */
jssip.message.WrappingHeaderParserFactory.prototype.createParserInternal =
    goog.abstractMethod;



/**
 * Wraps a header parser for creating decorated headers.
 * @param {!jssip.message.HeaderParser} wrappedParser
 * @constructor
 * @implements {jssip.message.HeaderParser}
 */
jssip.message.WrappingHeaderParser = function(wrappedParser) {
  /** @private {!jssip.message.HeaderParser} */
  this.wrappedParser_ = wrappedParser;
};


/** @override */
jssip.message.WrappingHeaderParser.prototype.parse = function() {
  var header = this.wrappedParser_.parse();
  return this.parseInternal(header);
};


/** @override */
jssip.message.WrappingHeaderParser.prototype.initializeHeaderName =
    goog.nullFunction;


/**
 * @param {!jssip.message.Header} header
 * @return {!jssip.message.Header} A decorated header
 * @protected
 */
jssip.message.WrappingHeaderParser.prototype.parseInternal =
    goog.abstractMethod;
