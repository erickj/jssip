goog.provide('jssip.uri.UriParser');
goog.provide('jssip.uri.UriParserFactory');

goog.require('jssip.parser.Parser');



/**
 * @interface
 */
jssip.uri.UriParserFactory = function() {};


/**
 * Create a new Uri parser for the given Uri.
 * @param {string} uri
 * @return {!jssip.uri.UriParser} The uri parser.
 */
jssip.uri.UriParserFactory.prototype.createParser = function(uri) {};



/**
 * @interface
 * @extends {jssip.parser.Parser}
 */
jssip.uri.UriParser = function() {};


/**
 * @param {string} uriParameters
 * @return {!Object.<(string|boolean)>} The parsed parameters
 */
jssip.uri.UriParser.prototype.parseParameters = goog.abstractMethod;
