goog.provide('jssip.testing.util.parseutil');

goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.message.MessageParser');
goog.require('jssip.parser.ParserRegistry');


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
