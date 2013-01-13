goog.provide('jssip.ParserManager');

goog.require('jssip.message.Parser');



/**
 * The main parser object used to parse SIP messages.
 * @constructor
 */
jssip.ParserManager = function() {
  /**
   * @type {!Object.<string,!jssip.message.HeaderParser>}
   * @private
   */
  this.headerParsers_ = {};

  /**
   * @type {!Object.<string,!jssip.uri.UriParser>}
   * @private
   */
  this.uriParsers_ = {};
};


/**
 * Parses a raw SIP message.
 * @param {string} rawMessageText The raw message text to parse.
 * @return {!jssip.message.Message} A parsed message object.
 */
jssip.ParserManager.prototype.parse = function(rawMessageText) {
  var messageParser = new jssip.message.Parser(rawMessageText);
  return messageParser.parse();
};


/**
 * Registers a new header type parser with this parser instance.
 * @param {string} headerName The header name to register.
 * @param {string} headerShortName  The short name.
 * @param {!jssip.message.HeaderParser} headerParser The parser.
 */
jssip.ParserManager.prototype.registerHeaderParser =
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
jssip.ParserManager.prototype.registerUriParser =
    function(uriScheme, uriParser) {
  uriScheme = uriScheme.toLowerCase();

  if (this.uriParsers_[uriScheme]) {
    throw new Error('Already registered URI parser for: ' + uriScheme);
  }

  this.uriParsers_[uriScheme] = uriParser;
};
