goog.provide('jssip.sip.plugin.core.HeaderParser');
goog.provide('jssip.sip.plugin.core.HeaderParserFactoryImpl');

goog.require('jssip.message.Header');
goog.require('jssip.message.Header.Builder');
goog.require('jssip.message.HeaderParser');
goog.require('jssip.message.HeaderParserFactory');
goog.require('jssip.parser.AbstractParserFactory');
goog.require('jssip.parser.ParseError');
goog.require('jssip.sip.grammar.rfc3261');



/**
 * @param {!jssip.event.EventBus} eventBus
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 * @extends {jssip.parser.AbstractParserFactory}
 */
jssip.sip.plugin.core.HeaderParserFactoryImpl = function(eventBus) {
  goog.base(this, eventBus);
};
goog.inherits(jssip.sip.plugin.core.HeaderParserFactoryImpl,
    jssip.parser.AbstractParserFactory);


/**
 * @override
 * @return {!jssip.message.HeaderParser}
 */
jssip.sip.plugin.core.HeaderParserFactoryImpl.prototype.createParser =
    function(headerName, headerValue) {
  var parser = new jssip.sip.plugin.core.HeaderParser(headerName, headerValue);
  this.setupParser(parser);
  return parser;
};



/**
 * @param {string} headerName
 * @param {string} headerValue
 * @constructor
 * @implements {jssip.message.HeaderParser}
 * @extends {jssip.parser.AbstractParser}
 */
jssip.sip.plugin.core.HeaderParser = function(headerName, headerValue) {
  /** @private {string} */
  this.headerName_ = headerName;

  /** @private {string} */
  this.headerValue_ = headerValue;

  /** @private {!jssip.message.Header.Builder} */
  this.builder_ = new jssip.message.Header.Builder();
};


/**
 * @override
 * @return {!jssip.message.Header}
 */
jssip.sip.plugin.core.HeaderParser.prototype.parse = function() {
  try {
    var result =
      jssip.sip.grammar.rfc3261.parse(this.headerValue_, this.headerName_);
  } catch (e) {
    if (e instanceof jssip.sip.grammar.rfc3261.SyntaxError) {
      throw new jssip.parser.ParseError(e.message);
    }
    throw e;
  }
  return this.builder_.addPropertyPair(
        jssip.message.Header.PropertyName.NAME, this.headerName_).
    addPropertyPair(
        jssip.message.Header.PropertyName.RAW_VALUE, this.headerValue_).
    addPropertyPair(
        jssip.message.Header.PropertyName.PARSED_VALUE, result).build();
};
