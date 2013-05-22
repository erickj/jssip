goog.provide('jssip.uri.UriParserFactory');

goog.require('jssip.uri.UriParser');



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
