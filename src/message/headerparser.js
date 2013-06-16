goog.provide('jssip.message.HeaderParser');

goog.require('jssip.parser.Parser');



/**
 * @interface
 * @extends {jssip.parser.Parser}
 */
jssip.message.HeaderParser = function() {};


/**
 * The AbstractParserFactory class defines #createParser to only accept a single
 * string parameter.  Header parsers however need a name and value.  This method
 * allows callers to set the header name for the header parser before parsing.
 * @see http://closuretools.blogspot.com/2012/06/subtyping-functions-without-poking-your.html
 * @param {string} headerName
 */
jssip.message.HeaderParser.prototype.initializeHeaderName = goog.abstractMethod;


/**
 * @override
 * @return {!jssip.message.Header}
 */
jssip.message.HeaderParser.prototype.parse = goog.abstractMethod;
