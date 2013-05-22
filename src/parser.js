goog.provide('jssip.ParseError');
goog.provide('jssip.ParseWarning');
goog.provide('jssip.Parser');



/**
 * Custom error for parse errors. A parse error indicates the message
 * is grossly malformed and no further processing should be done on
 * the message.  Parse errors will be thrown during parsing and should
 * be caught.
 * @param {string} message The error message.
 * @constructor
 * @extends {Error}
 */
jssip.ParseError = function(message) {
  goog.base(this, message);
};
goog.inherits(jssip.ParseError, Error);



/**
 * Parse warnings are lower grade than parse errors, they indicate a
 * particular field is malformed but parsing of the message as a whole
 * can continue.  Parse warnings will be added to the message context.
 * @param {string} message The warning message.
 * @constructor
 */
jssip.ParseWarning = function(message) {
  /**
   * @type {string}
   */
  this.message = message;
};



/**
 * @interface
 */
jssip.Parser = function() {};


/**
 * Parse something.
 * @return {*} The object that has been parsed.
 */
jssip.Parser.prototype.parse = goog.abstractMethod;
