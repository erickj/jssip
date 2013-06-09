goog.provide('jssip.parser.AbstractParserFactory');



/**
 * Abstract base class for parser factories.
 * @param {!goog.events.EventTarget} eventTarget The event target to use as the
 *     parent event target for created parsers.
 * @constructor
 */
jssip.parser.AbstractParserFactory = function(eventTarget) {
  /** @private {!goog.events.EventTarget} */
  this.eventTarget_ = eventTarget;
};


/**
 * Sets common properties on this paresr.  Currently this sets the event bus as
 * the parent event target for the parser.
 * @param {!jssip.parser.AbstractParser} parser
 * @protected
 */
jssip.parser.AbstractParserFactory.prototype.setupParser = function(parser) {
  parser.setParentEventTarget(this.eventTarget_);
};


/**
 * Create the parser.
 * @param {string} text The text to parse.
 * @return {!jssip.parser.Parser}
 */
jssip.parser.AbstractParserFactory.prototype.createParser = goog.abstractMethod;
