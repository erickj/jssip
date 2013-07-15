goog.provide('jssip.sip.plugin.core.HeaderParser');
goog.provide('jssip.sip.plugin.core.HeaderParserFactoryImpl');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('jssip.message.HeaderImpl');
goog.require('jssip.message.HeaderParser');
goog.require('jssip.message.HeaderParserFactory');
goog.require('jssip.parser.AbstractParser');
goog.require('jssip.parser.AbstractParserFactory');
goog.require('jssip.parser.ParseError');
goog.require('jssip.sip.grammar.pegutil.SyntaxError');
goog.require('jssip.sip.grammar.rfc3261');



/**
 * Creates core plugin header parsers. Creates a normalized header name map to
 * handle header names that may be in different case or headers in their short
 * name form.  This header map is given to created header parsers so that they
 * may lookup header names without needing to handle name normalization.
 * @param {!jssip.event.EventBus} eventBus
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 * @extends {jssip.parser.AbstractParserFactory}
 */
jssip.sip.plugin.core.HeaderParserFactoryImpl = function(eventBus) {
  goog.base(this, eventBus);

  // Create the normalized header name map to handle variable case and short
  // header name lookups
  var headerNameMap = {};
  for (var headerKey in jssip.sip.protocol.rfc3261.HeaderType) {
    var header = jssip.sip.protocol.rfc3261.HeaderType[headerKey];
    headerNameMap[header.toLowerCase()] = header;
  }

  for (headerKey in jssip.sip.protocol.rfc3261.CompactHeaderType) {
    var shortHeader = jssip.sip.protocol.rfc3261.CompactHeaderType[headerKey];
    headerNameMap[shortHeader.toLowerCase()] =
        jssip.sip.protocol.rfc3261.HeaderType[headerKey];
  }

  /** @private {!Object} */
  this.normalizedHeaderNameMap_ = headerNameMap;
};
goog.inherits(jssip.sip.plugin.core.HeaderParserFactoryImpl,
    jssip.parser.AbstractParserFactory);


/**
 * @override
 * @param {string} headerValue
 * @return {!jssip.message.HeaderParser}
 */
jssip.sip.plugin.core.HeaderParserFactoryImpl.prototype.createParser =
    function(headerValue) {
  var parser = new jssip.sip.plugin.core.HeaderParser(
      headerValue, this.normalizedHeaderNameMap_);
  this.setupParser(parser);
  return parser;
};



/**
 * @param {string} headerValue
 * @param {!Object} normalizedHeaderNameMap The normalized header name map,
 *     provided by the header parser factory.
 * @constructor
 * @implements {jssip.message.HeaderParser}
 * @extends {jssip.parser.AbstractParser}
 */
jssip.sip.plugin.core.HeaderParser =
    function(headerValue, normalizedHeaderNameMap) {
  /** @private {string} */
  this.rawHeaderName_ = '';

  /** @private {string} */
  this.headerValue_ = headerValue;

  /** @private {!Object} */
  this.normalizedHeaderNameMap_ = normalizedHeaderNameMap;
};
goog.inherits(jssip.sip.plugin.core.HeaderParser, jssip.parser.AbstractParser);


/** @override */
jssip.sip.plugin.core.HeaderParser.prototype.initializeHeaderName =
    function(headerName) {
  this.rawHeaderName_ = headerName;
};


/**
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.HeaderParser.prototype.getNormalHeaderName_ = function() {
  var normalKey = this.rawHeaderName_.toLowerCase();
  var normalHeaderName =
      this.normalizedHeaderNameMap_[normalKey];
  if (!normalHeaderName) {
    throw Error('Unknown header: ' + this.rawHeaderName_);
  }
  return normalHeaderName;
};


/**
 * @return {string}
 * @private
 */
jssip.sip.plugin.core.HeaderParser.prototype.getStartRule_ = function() {
  return this.getNormalHeaderName_().replace('-', '_');
};


/**
 * @override
 * @return {!jssip.message.Header}
 */
jssip.sip.plugin.core.HeaderParser.prototype.parse = function() {
  try {
    var result = jssip.sip.grammar.rfc3261.parse(
        this.headerValue_, this.getStartRule_());
  } catch (e) {
    if (e instanceof jssip.sip.grammar.pegutil.SyntaxError) {
      throw new jssip.parser.ParseError(e.message);
    }
    throw e;
  }
  goog.asserts.assert(goog.isArray(result));
  return new jssip.message.HeaderImpl(
      this.getNormalHeaderName_(), this.headerValue_, result);
};
