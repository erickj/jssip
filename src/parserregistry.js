goog.provide('jssip.ParserRegistry');



/**
 * Registers parser factories and returns parser instances for
 * message, header, and URI parsers.
 * @param {!jssip.message.MessageParserFactory} messageParserFactory The
 *     parser factory for providing message parser instances.
 * @constructor
 */
jssip.ParserRegistry = function(messageParserFactory) {
  /** @private {!Object.<string,!jssip.message.HeaderParserFactory>} */
  this.headerParserFactories_ = {};

  /** @private {!Object.<string,!jssip.uri.UriParserFactory>} */
  this.uriParserFactories_ = {};

  /** @private {!jssip.message.MessageParserFactory} */
  this.messageParserFactory_ = messageParserFactory;

  /** @private {boolean} */
  this.finalized_ = false;
};


/**
 * Parses raw message text with the message parser.
 * @param {string} rawMessageText
 * @return {!jssip.message.Message} The parsed message.
 */
jssip.ParserRegistry.prototype.parseMessage = function(rawMessageText) {
  return this.messageParserFactory_.createParser(rawMessageText).parse();
};


/**
 * Parses a header with a registered header parser.
 * @param {string} name
 * @param {string} value
 * @return {!jssip.message.Header} The parsed header.
 */
jssip.ParserRegistry.prototype.parseHeader = function(name, value) {
  var parserFactory = this.headerParserFactories_[name.toLowerCase()];
  if (!parserFactory) {
    throw Error('Unable to locate Header parser for header ' + name);
  }
  return parserFactory.createParser(name, value).parse();
};


/**
 * Parses a URI with a registered URI parser.
 * @param {string} uri
 * @return {!jssip.uri.Uri} The parsed URI.
 */
jssip.ParserRegistry.prototype.parseUri = function(uri) {
  var scheme = uri.substring(0, uri.indexOf(':'));
  if (!scheme) {
    throw Error('Unable to parse URI with unknown scheme');
  }
  var parserFactory = this.uriParserFactories_[scheme.toLowerCase()];
  if (!parserFactory) {
    throw Error('Unable to locate URI parser for scheme ' + scheme);
  }
  return parserFactory.createParser(uri).parse();
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
  if (this.finalized_) {
    throw Error('ParserRegistry finalized. Unable to register header parser ' +
        'for header ' + name);
  }

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
  if (this.finalized_) {
    throw Error('ParserRegistry finalized. Unable to register URI parser ' +
        'for scheme ' + scheme);
  }

  scheme = scheme.toLowerCase();
  if (scheme in this.uriParserFactories_) {
    return false;
  }

  this.uriParserFactories_[scheme] = parserFactory;
  return true;
};


/**
 * Finalizes the registration stage of the parser registry.  Any
 * registrations after this point will throw an error.
 * @throws {Error}
 */
jssip.ParserRegistry.prototype.finalize = function() {
  if (this.finalized_) {
    throw Error('ParserRegistry already finalized');
  }
  this.finalized_ = true;
};
