goog.provide('jssip.message.MessageContext');
goog.provide('jssip.message.MessageContext.ParseEvent');

goog.require('goog.events.EventTarget');



/**
 * A container for passing messages through the SIP stack and
 * accessing header and URI values. This is the primary interface for
 * interacting with messages in the system.  All access to values
 * present in a message should be requested through this interface.
 *
 * @param {string} rawMessageText The raw message text.
 * @param {!jssip.ParserRegistry} parserRegistry The parser registry for
 *     message, header, and URI parsers.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jssip.message.MessageContext = function(rawMessageText, parserRegistry) {
  goog.base(this);

  /**
   * @type {string}
   * @private
   */
  this.rawMessageText_ = rawMessageText;

  /**
   * @type {!jssip.ParserRegistry}
   * @private
   */
  this.parserRegistry_ = parserRegistry;

  /**
   * @type {!Array<!jssip.ParseWarning>}
   * @private
   */
  this.parseWarnings_ = [];

  /**
   * @type {!Array.<!jssip.ParseError>}
   * @private
   */
  this.parseErrors_ = [];

  /**
   * @type {jssip.message.Message}
   * @private
   */
  this.message_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.inited_ = false;
};
goog.inherits(jssip.message.MessageContext, goog.events.EventTarget);


/**
 * @enum {string}
 */
jssip.message.MessageContext.EVENT = {
  PARSE_ERROR: 'parse-error',
  PARSE_WARNING: 'parse-warning'
};


/**
 * Initialize the message context, this invokes parsing the raw
 * message text into a message.  Before initialization listeners may
 * be set up to handle parse warning and error events emitted from the
 * message context.
 */
jssip.message.MessageContext.prototype.init = function() {
  if (!this.inited_) {
    this.inited_ = true;
    this.message_ = this.parseMessage_(this.rawMessageText_);
  }
};


/**
 * Gets the parse errors in the specified range.
 * @param {number} start The start index.
 * @param {number} len The number of errors to retrieve.
 * @return {!Array.<!jssip.ParseError>} The parse errors.
 */
jssip.message.MessageContext.prototype.getParseErrors = function(start, len) {
  return this.parseErrors_.slice(start, start + len);
};


/**
 * Gets the parse warnings in the specified range.
 * @param {number} start The start index.
 * @param {number} len The number of warnings to retrieve.
 * @return {!Array.<!jssip.ParseWarning>} The parse warnings.
 */
jssip.message.MessageContext.prototype.getParseWarnings = function(start, len) {
  return this.parseWarnings_.slice(start, start + len);
};


/**
 * Returns the raw message text.
 * @return {string} Message text.
 */
jssip.message.MessageContext.prototype.getRawMessageText = function() {
  return this.rawMessageText_;
};


/**
 * @return {boolean} Whether the message is a request. True indicates
 *     a request, false indicates a response.
 * @throws
 */
jssip.message.MessageContext.prototype.isRequest = function() {
  return this.getMessage_().isRequest();
};


/**
 * Returns the message if it has been parsed or throws an error.
 * @return {!jssip.message.Message} The message object.
 * @throws
 * @private
 */
jssip.message.MessageContext.prototype.getMessage_ = function() {
  if (!this.inited_) {
    throw new Error('Unable to return message on uninitialized context');
  } else if (!this.message_) {
    throw new Error('Context initialized but message parsing failed');
  }
  return this.message_;
};


/**
 * Parses a message object.
 * @param {string} text The raw message text.
 * @return {jssip.message.Message} The parsed message or null on error.
 * @private
 */
jssip.message.MessageContext.prototype.parseMessage_ = function(text) {
  var message = this.invokeParser_(
      this.parserRegistry_.createMessageParser(text));
  return /* @type {jssip.message.Message} */ (message);
};


/**
 * Runs a parser instance's parse method, guarding against parse
 * errors and collects parse warnings.
 * @param {!jssip.AbstractParser} parser The parser to invoke.
 * @return {Object} The parsed object or null if an error was encountered.
 * @private
 */
jssip.message.MessageContext.prototype.invokeParser_ = function(parser) {
  var result;
  try {
    result = parser.parse();
  } catch (e) {
    result = null;
    if (e instanceof jssip.ParseError) {
      this.parseErrors_.push(e);
      this.dispatchEvent(new jssip.message.MessageContext.ParseEvent(
          jssip.message.MessageContext.EVENT.PARSE_ERROR,
          this.parseErrors_.length - 1,
          1));
    } else {
      throw e;
    }
  }

  if (parser.parseWarnings.length) {
    var start = this.parseWarnings_.length;
    this.parseWarnings_ = this.parseWarnings_.concat(parser.parseWarnings);
    this.dispatchEvent(new jssip.message.MessageContext.ParseEvent(
        jssip.message.MessageContext.EVENT.PARSE_WARNING,
        start,
        parser.parseWarnings.length));
  }

  return result;
};



/**
 * An event describing an anomolous parse event.
 * @param {jssip.message.MessageContext.EVENT} type The event type.
 * @param {number} start The id of the error or warning.
 * @param {number} length The number of error or warning events that
 *     occurred.
 * @constructor
 */
jssip.message.MessageContext.ParseEvent = function(type, start, length) {
  /**
   * @type {string}
   */
  this.type = type;

  /**
   * @type {number}
   */
  this.start = start;

  /**
   * @type {number}
   */
  this.length = length;
};
