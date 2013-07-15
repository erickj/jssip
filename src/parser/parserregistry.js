goog.provide('jssip.parser.NoRegisteredHeaderParserError');
goog.provide('jssip.parser.NoRegisteredUriParserError');
goog.provide('jssip.parser.ParserRegistry');

goog.require('goog.dispose');
goog.require('jssip.parser.ParseError');
goog.require('jssip.parser.ParseEvent');
goog.require('jssip.parser.Parser');



/**
 * @param {string} headerName
 * @constructor
 * @extends {Error}
 */
jssip.parser.NoRegisteredHeaderParserError = function(headerName) {
  this.message = 'No header parser registered for header ' + headerName;
};
goog.inherits(jssip.parser.NoRegisteredHeaderParserError, Error);



/**
 * @param {string} scheme
 * @constructor
 * @extends {Error}
 */
jssip.parser.NoRegisteredUriParserError = function(scheme) {
  this.message = 'No URI parser registered for scheme ' + scheme;
};
goog.inherits(jssip.parser.NoRegisteredUriParserError, Error);



/**
 * Registers parser factories and returns parser instances for
 * message, header, and URI parsers.
 * @param {!jssip.message.MessageParserFactory} messageParserFactory The
 *     parser factory for providing message parser instances.
 * @param {!goog.events.EventTarget} eventTarget The event target for
 *     dispatching parse events to.
 * @constructor
 */
jssip.parser.ParserRegistry = function(messageParserFactory, eventTarget) {
  /** @private {!Object.<string,!jssip.message.HeaderParserFactory>} */
  this.headerParserFactories_ = {};

  /** @private {!Object.<string,!jssip.uri.UriParserFactory>} */
  this.uriParserFactories_ = {};

  /** @private {!jssip.message.MessageParserFactory} */
  this.messageParserFactory_ = messageParserFactory;

  /** @private {boolean} */
  this.finalized_ = false;

  /** @private {!goog.events.EventTarget} */
  this.eventTarget_ = eventTarget;
};


/**
 * Parses raw message text with the message parser.
 * @param {string} rawMessageText
 * @return {!jssip.message.Message} The parsed message.
 */
jssip.parser.ParserRegistry.prototype.parseMessage = function(rawMessageText) {
  return /** @type {!jssip.message.Message} */ (this.invokeParser_(
      this.messageParserFactory_.createParser(rawMessageText)));
};


/**
 * Parses a header with a registered header parser.
 * @param {string} name
 * @param {string} value
 * @return {!jssip.message.Header} The parsed header.
 */
jssip.parser.ParserRegistry.prototype.parseHeader = function(name, value) {
  var parserFactory = this.headerParserFactories_[name.toLowerCase()];
  if (!parserFactory) {
    throw new jssip.parser.NoRegisteredHeaderParserError(name);
  }
  var headerParser = parserFactory.createParser(value);
  headerParser.initializeHeaderName(name);
  return /** @type {!jssip.message.Header} */ (
      this.invokeParser_(headerParser));
};


/**
 * Parses a URI with a registered URI parser.
 * @param {string} uri
 * @return {!jssip.uri.Uri} The parsed URI.
 */
jssip.parser.ParserRegistry.prototype.parseUri = function(uri) {
  var scheme = uri.substring(0, uri.indexOf(':'));
  if (!scheme) {
    throw Error('Unable to parse URI with missing scheme');
  }
  var parserFactory = this.uriParserFactories_[scheme.toLowerCase()];
  if (!parserFactory) {
    throw new jssip.parser.NoRegisteredUriParserError(scheme);
  }
  return /** @type {!jssip.uri.Uri} */ (
      this.invokeParser_(parserFactory.createParser(uri)));
};


/**
 * Runs a parser instance's parse method. If an exception is caught during
 * parsing an event and the exception is a ParseError then an event will be
 * dispatched to allow handlers to deal with the event.  In any case all
 * exceptions will be rethrown.
 * @param {!jssip.parser.Parser} parser The parser to invoke.
 * @return {!Object} The parsed object.
 * @throws {jssip.parser.ParseError}
 * @throws {Error}
 * @private
 */
jssip.parser.ParserRegistry.prototype.invokeParser_ = function(parser) {
  try {
    return goog.asserts.assert(parser.parse());
  } catch (e) {
    if (e instanceof jssip.parser.ParseError) {
      this.eventTarget_.dispatchEvent(new jssip.parser.ParseEvent(
          jssip.parser.Parser.EventType.ERROR, e.message));
    }
    throw e;
  } finally {
    goog.dispose(parser);
  }
};


/**
 * Registers a new header type parser with this parser instance.
 * @param {string} name The header name to register.
 * @param {!jssip.message.HeaderParserFactory} parserFactory The parser factory.
 * @return {boolean} True indicates success, false indicates a
 *     previous registration exists for the header.
 */
jssip.parser.ParserRegistry.prototype.registerHeaderParserFactory =
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
jssip.parser.ParserRegistry.prototype.registerUriParserFactory =
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
jssip.parser.ParserRegistry.prototype.finalize = function() {
  if (this.finalized_) {
    throw Error('ParserRegistry already finalized');
  }
  this.finalized_ = true;
};
