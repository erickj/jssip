goog.provide('jssip.parser.ParseError');
goog.provide('jssip.parser.ParseEvent');
goog.provide('jssip.parser.Parser');

goog.require('goog.events.Event');



/**
 * Custom error for parse errors. A parse error indicates the message is grossly
 * malformed and no further parsing could be done on the message.  Parse errors
 * will be thrown during parsing and should be caught.
 * @param {string} message The error message.
 * @constructor
 * @extends {Error}
 */
jssip.parser.ParseError = function(message) {
  this.message = message;
};
goog.inherits(jssip.parser.ParseError, Error);



/**
 * An event for dispatching during parsing.
 * @param {jssip.parser.Parser.EventType} type
 * @param {string=} opt_message An optional message.
 * @param {string=} opt_value An optional value that generated the warning.
 * @constructor
 * @extends {goog.events.Event}
 */
jssip.parser.ParseEvent = function(type, opt_message, opt_value) {
  goog.base(this, type);

  /** @type {string} */
  this.message = opt_message || "";

  /** @type {?string} */
  this.value = opt_value || null;
};
goog.inherits(jssip.parser.ParseEvent, goog.events.Event);



/**
 * @interface
 */
jssip.parser.Parser = function() {};


/** @enum {string} */
jssip.parser.Parser.EventType = {
  ERROR: 'parsererror',
  WARNING: 'parserwarning'
};


/**
 * Parse something.
 * @return {!Object} The object that has been parsed.
 */
jssip.parser.Parser.prototype.parse = goog.abstractMethod;
