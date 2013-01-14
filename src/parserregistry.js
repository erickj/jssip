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
 * Registers a new header type parser with this parser instance.
 * @param {string} headerName The header name to register.
 * @param {string} headerShortName  The short name.
 * @param {!jssip.message.HeaderParser} headerParser The parser.
 */
jssip.ParserRegistry.prototype.registerHeaderParser =
    function(headerName, headerShortName, headerParser) {
  headerName = headerName.toLowerCase();
  headerShortName = headerShortName.toLowerCase();

  if (this.headerParsers_[headerName]) {
    throw new Error('Already registered header parser for: ' + headerName);
  }
  if (this.headerParsers_[headerShortName]) {
    throw new Error('Already registered header parser for: ' + headerShortName);
  }

  this.headerParsers_[headerName] = headerParser;
  this.headerParsers_[headerShortName] = headerParser;
};


/**
 * Registers a new URI scheme parser with this parser instance.
 * @param {string} uriScheme The URI scheme.
 * @param {!jssip.uri.UriParser} uriParser The parser.
 */
jssip.ParserRegistry.prototype.registerUriParser =
    function(uriScheme, uriParser) {
  uriScheme = uriScheme.toLowerCase();

  if (this.uriParsers_[uriScheme]) {
    throw new Error('Already registered URI parser for: ' + uriScheme);
  }

  this.uriParsers_[uriScheme] = uriParser;
};
