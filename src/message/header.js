goog.provide('jssip.message.Header');



/**
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
