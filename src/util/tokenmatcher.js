goog.provide('jssip.util.TokenMatcher');


/**
 * Provides an object for matching token patterns positively or
 * negatively.
 * @param {!RegExp} regex The regular expression to match.
 * @param {boolean=} opt_rejectMatch Whether the test should fail if the
 *     pattern matches.  Default is false.
 * @constructor
 */
jssip.util.TokenMatcher = function(regex, opt_rejectMatch) {
  /**
   * @type {!RegExp}
   * @private
   */
  this.regex_ = regex;

  /**
   * @type {boolean}
   * @private
   */
  this.rejectMatch_ = !!opt_rejectMatch;
};


/**
 * @param {string} token The token to test.
 * @return {boolean} Whether the token matches.
 */
jssip.util.TokenMatcher.prototype.test = function(token) {
  var match = this.regex_.test(token);
  return this.rejectMatch_ ? !match : match;
};
