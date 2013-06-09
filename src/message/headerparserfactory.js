goog.provide('jssip.message.HeaderParserFactory');



/**
 * @interface
 */
jssip.message.HeaderParserFactory = function() {};


/**
 * Create a new header parser for the given header.
 * @param {string} headerValue The header value.
 * @return {!jssip.message.HeaderParser} The header parser.
 */
jssip.message.HeaderParserFactory.prototype.createParser =
    function(headerValue) {};
