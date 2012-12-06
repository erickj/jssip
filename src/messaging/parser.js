goog.provide('jssip.messaging.Parser');
goog.provide('jssip.messaging.HeaderParser');
goog.provide('jssip.messaging.UriParser');

goog.require('goog.string.Parser');

/**
 * @implements {goog.string.Parser}
 * @constructor
 */
jssip.messaging.UriParser = function() {};

/**
 * @implements {goog.string.Parser}
 * @constructor
 */
jssip.messaging.HeaderParser = function() {};

/**
 * @implements {goog.string.Parser}
 * @constructor
 */
jssip.messaging.Parser = function() {
  /**
   * @type {!Object.<string,!jssip.messaging.HeaderParser>}
   * @private
   */
  this.headerParsers_ = {};

  /**
   * @type {!Object.<string,!jssip.messaging.UriParser>}
   * @private
   */
  this.uriParsers_ = {};
};


/**
 * @param {string} headerName
 * @param {string} headerShortName
 * @param {!jssip.messaging.HeaderParser} headerParser
 */
jssip.messaging.Parser.prototype.registerHeaderParser =
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
 * @param {string} uriScheme
 * @param {!jssip.messaging.UriParser} uriParser
 */
jssip.messaging.Parser.prototype.registerUriParser =
    function(uriScheme, uriParser) {
  uriScheme = uriScheme.toLowerCase();

  if (this.uriParsers_[uriScheme]) {
    throw new Error('Already registered URI parser for: ' + uriScheme);
  }

  this.uriParsers_[uriScheme] = uriParser;
};
