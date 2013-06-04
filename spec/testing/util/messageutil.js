goog.provide('jssip.testing.util.messageutil');


/**
 * Runs an expectation that the given header name-value pairs pass jasmine
 * {@code expect(header[name]).toEqual(value)} testing.  If the value is a
 * RegExp then {@code toMatch} will be used.
 * @param {!Object} nameValuePairs The expected name value pairs
 * @param {!jssip.message.Message} message The message to check against
 */
jssip.testing.util.messageutil.checkMessageHeaders =
    function(nameValuePairs, message) {
  for (var name in nameValuePairs) {
    var value = nameValuePairs[name];
    var method = (value instanceof RegExp) ? 'toMatch' : 'toEqual';
    if (!(value instanceof RegExp) && !goog.isArray(value)) {
      value = [value];
    }

    var expectation = expect(message.getHeaderValue(name));
    expectation[method].call(expectation, value);
  }
};
