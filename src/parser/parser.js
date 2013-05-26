goog.provide('jssip.parser.ParseError');
goog.provide('jssip.parser.ParseWarning');
goog.provide('jssip.parser.Parser');



/**
 * Custom error for parse errors. A parse error indicates the message
 * is grossly malformed and no further processing should be done on
 * the message.  Parse errors will be thrown during parsing and should
 * be caught.
 * @param {string} message The error message.
 * @constructor
 * @extends {Error}
 */
jssip.parser.ParseError = function(message) {
  goog.base(this, message);
};
goog.inherits(jssip.parser.ParseError, Error);



/**
 * Parse warnings are lower grade than parse errors, they indicate a
 * particular field is malformed but parsing of the message as a whole
 * can continue.  Parse warnings will be added to the message context.
 * @param {string} message The warning message.
 * @constructor
 */
jssip.parser.ParseWarning = function(message) {
  /**
   * @type {string}
   */
  this.message = message;
};



/**
 * @interface
 */
jssip.parser.Parser = function() {};


/**
 * Parse something.
 * @return {*} The object that has been parsed.
 */
jssip.parser.Parser.prototype.parse = goog.abstractMethod;
