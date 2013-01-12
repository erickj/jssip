goog.provide('jssip.util.TokenMatcherSpec');

goog.require('jssip.util.RegexpTokenMatcher');
goog.require('jssip.util.AnyTokenMatcher');

describe('jssip.util.TokenMatcher', function() {
  describe('jssip.util.RegexpTokenMatcher', function() {
    var pattern = /^a$/;
    var matchingToken = 'a';
    var nonmatchingToken = 'b';

    var tokenMatcher;
    var antiTokenMatcher;

    beforeEach(function() {
      tokenMatcher = new jssip.util.RegexpTokenMatcher(pattern);
      antiTokenMatcher = new jssip.util.RegexpTokenMatcher(pattern, true);
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

  describe('jssip.util.AnyTokenMatcher', function() {
    it('should return true any token matcher matches or false otherwise',
       function() {
         var tokenMatcherA = new jssip.util.RegexpTokenMatcher(/a/);
         var tokenMatcherB = new jssip.util.RegexpTokenMatcher(/b/);
         var anyTokenMatcher = new jssip.util.AnyTokenMatcher(
             [tokenMatcherA, tokenMatcherB]);
         expect(anyTokenMatcher.test('a')).toBe(true);
         expect(anyTokenMatcher.test('b')).toBe(true);
         expect(anyTokenMatcher.test('c')).toBe(false);
       });
  });
});