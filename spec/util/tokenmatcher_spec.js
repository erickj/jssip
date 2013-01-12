goog.provide('jssip.util.TokenMatcherSpec');

goog.require('jssip.util.TokenMatcher');

describe('jssip.util.TokenMatcher', function() {
  var pattern = /^a$/;
  var matchingToken = 'a';
  var nonmatchingToken = 'b';

  var tokenMatcher;
  var antiTokenMatcher;

  beforeEach(function() {
    tokenMatcher = new jssip.util.TokenMatcher(pattern);
    antiTokenMatcher = new jssip.util.TokenMatcher(pattern, true);
  });

  it('should accept if there is a match', function() {
    expect(tokenMatcher.test(matchingToken)).toBe(true);
  });

  it('should reject if there is not a match', function() {
    expect(tokenMatcher.test(nonmatchingToken)).toBe(false);
  });

  it('should accept a reject match if there is no match', function() {
    expect(antiTokenMatcher.test(nonmatchingToken)).toBe(true);
  });

  it('should reject a match when testing for reject match', function() {
    expect(antiTokenMatcher.test(matchingToken)).toBe(false);
  });
});