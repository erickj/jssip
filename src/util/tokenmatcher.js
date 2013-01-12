goog.provide('jssip.util.TokenMatcher');
goog.provide('jssip.util.RegexpTokenMatcher');
goog.provide('jssip.util.AnyTokenMatcher');


/**
 * The token matcher interface provides a test method to determine if
 * a string token is a match for some condition.
 * @interface
 */
jssip.util.TokenMatcher = function() {};


/**
 * @param {string} token The token to test.
 * @return {boolean} Whether the token matches.
 */
jssip.util.TokenMatcher.prototype.test = function(token) {};



/**
 * An object for matching token patterns positively or negatively
 * against regular expressions.
 * @param {!RegExp} regex The regular expression to match.
 * @param {boolean=} opt_rejectMatch Whether the test should fail if the
 *     pattern matches.  Default is false.
 * @implements {jssip.util.TokenMatcher}
 * @constructor
 */
jssip.util.RegexpTokenMatcher = function(regex, opt_rejectMatch) {
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


/** @override */
jssip.util.RegexpTokenMatcher.prototype.test = function(token) {
  var match = this.regex_.test(token);
  return this.rejectMatch_ ? !match : match;
};



/**
 * A token matcher that will return true if any of the token matchers
 * supplied in the constructor return a positive match.
 * @param {!Array<!jssip.util.TokenMatcher>} matchers The matchers array.
 * @implements {jssip.util.TokenMatcher}
 * @constructor
 */
jssip.util.AnyTokenMatcher = function(matchers) {
  /**
   * @type {!Array.<!jssip.util.TokenMatcher>}
   * @private
   */
  this.matchers_ = matchers;
};


/** @override */
jssip.util.AnyTokenMatcher.prototype.test = function(token) {
  for (var i = 0; i < this.matchers_.length; i++) {
    if (this.matchers_[i].test(token)) {
      return true;
    }
  }
  return false;
};
