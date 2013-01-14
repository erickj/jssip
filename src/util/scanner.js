goog.provide('jssip.util.Scanner');

/**
 * A string scanner.
 * @param {string} text The text to scan.
 * @constructor
 */
jssip.util.Scanner = function(text) {
  /**
   * @type {string}
   * @private
   */
  this.text_ = text;

  /**
   * The current location. -1 indicates EOF.
   * @type {number}
   * @private
   */
  this.index_ = 0;
};


/**
 * @type {number}
 * @const
 */
jssip.util.Scanner.EOF = -1;


/**
 * @enum {!Array.<string>}
 */
jssip.util.Scanner.TOKEN = {
  CRLF: ['\r', '\n']
};


/**
 * Returns the current position of the scanner
 * @return {number} The current position.
 */
jssip.util.Scanner.prototype.getPosition = function() {
  return this.index_;
};


/**
 * @return {boolean} Whether the scanner has reached the end of the string.
 */
jssip.util.Scanner.prototype.isEof = function() {
  return this.index_ == jssip.util.Scanner.EOF;
};


/**
 * Gets the substring from the message from position start to end. If end is
 * greater than message length return from start to the end of the message.  If
 * start is greater than end, throw an error.
 * @param {number} start The start position.
 * @param {number} end The end position.
 * @return {string} The substring.
 */
jssip.util.Scanner.prototype.getSubstring = function(start, end) {
  if (start > end) {
    throw new Error('Start index must be less than end index');
  }
  return this.text_.substring(start, end);
};


/**
 * Return the start position of the next token in the text or -1 if
 * no such occurrence.  The position is advanced to the end of the
 * token or EOF if no match is found. Throws an error if scanning has
 * previously reached EOF.
 * @param {jssip.util.Scanner.TOKEN|Array.<string>} token The token.
 * @return {number} The position of the first character in the token.
 */
jssip.util.Scanner.prototype.nextTokenPosition = function(token) {
  if (this.isEof()) {
    throw new Error('Scanner reached EOF');
  }

  var position = jssip.util.Scanner.EOF;

  for (var i = this.index_; i < this.text_.length; i++) {
    var cursor = 0;
    while (cursor < token.length && token[cursor] == this.text_[i + cursor]) {
      cursor++;
    }
    if (cursor == token.length) {
      position = i;
      this.index_ = position + token.length;
      break;
    }
  }

  if (position == jssip.util.Scanner.EOF) {
    this.index_ = jssip.util.Scanner.EOF;
  }

  return position;
};
