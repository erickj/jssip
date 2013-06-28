goog.provide('jssip.message.Header');



/**
 * A header is a name-value pair from a message.
 * @interface
 */
jssip.message.Header = function() {};


/**
 * @return {string}
 */
jssip.message.Header.prototype.getHeaderName = goog.abstractMethod;


/**
 * @return {string}
 */
jssip.message.Header.prototype.getRawValue = goog.abstractMethod;


/**
 * @return {!Array}
 */
jssip.message.Header.prototype.getParsedValue = goog.abstractMethod;
