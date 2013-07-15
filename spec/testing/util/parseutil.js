goog.provide('jssip.testing.util.parseutil');
goog.provide('jssip.testing.util.parseutil.FakeUriParser');

goog.require('jssip.event.EventBus');
goog.require('jssip.message.HeaderParser');
goog.require('jssip.message.HeaderParserFactory');
goog.require('jssip.message.MessageParser');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.parser.ParserRegistry');



/**
 * @constructor
 * @implements {jssip.uri.UriParserFactory}
 * @implements {jssip.uri.UriParser}
 */
jssip.testing.util.parseutil.FakeUriParser = function() {
  /** @private {string} */
  this.parameterDelimeter_ = ';';
};


/** @override */
jssip.testing.util.parseutil.FakeUriParser.prototype.createParser =
    function(uri) {
  return this;
};


/**
 * @param {!jssip.uri.Uri} uri
 */
jssip.testing.util.parseutil.FakeUriParser.prototype.setUri = function(uri) {
  this.uri_ = uri;
};


/** @override */
jssip.testing.util.parseutil.FakeUriParser.prototype.parse = function() {
  return this.uri_;
};


/** @override */
jssip.testing.util.parseutil.FakeUriParser.prototype.parseParameters =
    function(uriParameters) {
  var parts = uriParameters.split(';');
  var params = {};
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length) {
      var kvp = parts[i].split('=');
      params[kvp[0]] = kvp.length > 1 ? kvp[1] : true
    }
  }
  return params;
};


/**
 * Creates a raw message context with the given message text.
 * @return {!jssip.parser.ParserRegistry}
 */
jssip.testing.util.parseutil.createParserRegistry = function() {
  var eventBus = new jssip.event.EventBus();
  var messageParserFactory =
      new jssip.message.MessageParserFactory(eventBus);
  return new jssip.parser.ParserRegistry(messageParserFactory);
};


/**
 * Creates a strict mock parser registry.
 * @param {!goog.testing.MockControl} ctrl
 * @return {!jssip.parser.ParserRegistry}
 */
jssip.testing.util.parseutil.createMockParserRegistry = function(ctrl) {
  return /** @type {!jssip.parser.ParserRegistry} */ (
      ctrl.createStrictMock(jssip.parser.ParserRegistry));
};


/**
 * Creates a strick mock header parser factory.
 * @param {!goog.testing.MockControl} ctrl
 * @return {!jssip.message.HeaderParserFactory}
 */
jssip.testing.util.parseutil.createMockHeaderParserFactory = function(ctrl) {
  return /** @type {!jssip.message.HeaderParserFactory} */ (
      ctrl.createStrictMock(jssip.message.HeaderParserFactory));
};


/**
 * Creates a strick mock header parser.
 * @param {!goog.testing.MockControl} ctrl
 * @return {!jssip.message.HeaderParser}
 */
jssip.testing.util.parseutil.createMockHeaderParser = function(ctrl) {
  return /** @type {!jssip.message.HeaderParser} */ (
      ctrl.createStrictMock(jssip.message.HeaderParser));
};
