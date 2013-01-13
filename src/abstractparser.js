goog.provide('jssip.AbstractParser');
goog.provide('jssip.ParseError');
goog.provide('jssip.ParseWarning');


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



// TODO(erick): fill this in as needed.
/**
 * An abstract base class for parsers in the libary.
 * @param {string} rawText Text to be parsed.
 * @constructor
 */
jssip.AbstractParser = function(rawText) {
  /**
   * @type {string}
   * @private
   */
  this.rawText_ = rawText;

  /**
   * @type {!jssip.util.Scanner}
   * @private
   */
  this.scanner_ = new jssip.util.Scanner(rawText);

  /**
   * @type {number}
   * @private
   */
  this.position_ = 0;

  /**
   * @type {!Array.<!jssip.ParseWarning>}
   */
  this.parseWarnings = [];
};


/**
 * Get the raw text
 * @return {string} The raw text.
 * @protected
 */
jssip.AbstractParser.prototype.getRawText = function() {
  return this.rawText_;
};


/**
 * Read the next line from the scanner.
 * @return {?string} The next line or null if we've read everything.
 */
jssip.AbstractParser.prototype.readNextLine = function() {
  if (this.scanner_.isEof()) return null;

  var crlfPos = this.scanner_.nextTokenPosition(jssip.util.Scanner.TOKEN.CRLF);
  var line = this.scanner_.getSubstring(
      this.position_,
      this.scanner_.isEof() ? this.rawText_.length : crlfPos);
  this.position_ = this.scanner_.getPosition();
  return line;
};


/**
 * The parse method is the public method for all parsers in the library.
 * @return {*} The object that has been parsed.
 */
jssip.AbstractParser.prototype.parse = goog.abstractMethod;
