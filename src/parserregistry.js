goog.provide('jssip.ParserRegistry');



/**
 * Registers parser factories and returns parser instances for
 * message, header, and URI parsers.
 * @param {!jssip.message.MessageParserFactory} messageParserFactory The
 *     parser factory for providing message parser instances.
 * @constructor
 */
jssip.ParserRegistry = function(messageParserFactory) {
  /**
   * @type {!Object.<string,!jssip.message.HeaderParserFactory>}
   * @private
   */
  this.headerParserFactories_ = {};

  /**
   * @type {!Object.<string,!jssip.uri.UriParserFactory>}
   * @private
   */
  this.uriParserFactories_ = {};

  /**
   * @type {!jssip.message.MessageParserFactory}
   * @private
   */
  this.messageParserFactory_ = messageParserFactory;
};


/**
 * Creates a new message parser.
 * @param {string} text The text to parse.
 * @return {!jssip.message.MessageParser}
 */
jssip.ParserRegistry.prototype.createMessageParser = function(text) {
  return this.messageParserFactory_.createParser(text);
};


/**
 * Registers a new header type parser with this parser instance.
 * @param {string} name The header name to register.
 * @param {!jssip.message.HeaderParserFactory} parserFactory The parser factory.
 * @return {boolean} True indicates success, false indicates a
 *     previous registration exists for the header.
 */
jssip.ParserRegistry.prototype.registerHeaderParserFactory =
    function(name, parserFactory) {
  name = name.toLowerCase();
  if (name in this.headerParserFactories_) {
    return false;
  }

  this.headerParserFactories_[name] = parserFactory;
  return true;
};


/**
 * Registers a new URI scheme parser with this parser registry.
 * @param {string} scheme The URI scheme.
 * @param {!jssip.uri.UriParserFactory} parserFactory The parser factory.
 * @return {boolean} True indicates success, false indicates a
 *     previous registration exists for the scheme.
 */
jssip.ParserRegistry.prototype.registerUriParserFactory =
    function(scheme, parserFactory) {
  scheme = scheme.toLowerCase();
  if (scheme in this.uriParserFactories_) {
    return false;
  }

  this.uriParserFactories_[scheme] = parserFactory;
  return true;
};
