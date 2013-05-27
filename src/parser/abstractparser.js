goog.provide('jssip.parser.AbstractParser');

goog.require('goog.events.EventTarget');
goog.require('jssip.parser.ParseEvent');
goog.require('jssip.parser.Parser');
goog.require('jssip.util.Scanner');



/**
 * An abstract base class for parsers in the libary.
 * @param {string} rawText Text to be parsed.
 * @constructor
 * @implements {jssip.parser.Parser}
 * @extends {goog.events.EventTarget}
 */
jssip.parser.AbstractParser = function(rawText) {
  /** @private {string} */
  this.rawText_ = rawText;

  /** @private {!jssip.util.Scanner} */
  this.scanner_ = new jssip.util.Scanner(rawText);

  /** @private {number} */
  this.position_ = 0;
};
goog.inherits(jssip.parser.AbstractParser, goog.events.EventTarget);


/**
 * Dispatches a parser event.
 * @param {string} message
 * @param {jssip.parser.Parser.EventType=} opt_type An optional event type, the
 *     default is warning.
 * @protected
 */
jssip.parser.AbstractParser.prototype.dispatchParseEvent =
    function(message, opt_type) {
  this.dispatchEvent(new jssip.parser.ParseEvent(
      opt_type || jssip.parser.Parser.EventType.WARNING,
      message, this.rawText_));
};


/**
 * Get the raw text
 * @return {string} The raw text.
 * @protected
 */
jssip.parser.AbstractParser.prototype.getRawText = function() {
  return this.rawText_;
};


/**
 * Get the current cursor position.
 * @return {number} The cursor position.
 * @protected
 */
jssip.parser.AbstractParser.prototype.getPosition = function() {
  return this.position_;
};


/**
 * @return {boolean} Whether we have scanned past the end of the text.
 */
jssip.parser.AbstractParser.prototype.isEof = function() {
  return this.scanner_.isEof();
};


/**
 * Get a substring from the raw text
 * @param {number} start The start position.
 * @param {number=} opt_end The end position or the end of the string
 *     by default.
 * @return {string} The substring.
 * @protected
 */
jssip.parser.AbstractParser.prototype.readSubstring = function(start, opt_end) {
  opt_end = goog.isDef(opt_end) ? opt_end : this.rawText_.length;
  return this.scanner_.getSubstring(start, opt_end);
};


/**
 * Read the next line from the scanner.
 * @return {?string} The next line or null if we've read everything.
 * @protected
 */
jssip.parser.AbstractParser.prototype.readNextLine = function() {
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
 * @return {!Object} The object that has been parsed.
 */
jssip.parser.AbstractParser.prototype.parse = goog.abstractMethod;
