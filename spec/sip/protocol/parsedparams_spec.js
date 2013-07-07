goog.provide('jssip.sip.protocol.ParsedParamsSpec');

goog.require('jssip.sip.protocol.ParsedParams');

describe('jssip.sip.protocol.ParsedParams', function() {
  var parsedParamArray;
  var parsedParams;

  beforeEach(function() {
    parsedParamArray = [[';', ['fiz', '=', 'buz']], [';', ['baz']]];
    parsedParams = new jssip.sip.protocol.ParsedParams(parsedParamArray);
  });

  describe('#hasParameter', function() {
    it('should have params in the parsed param array', function() {
      expect(parsedParams.hasParameter('fiz')).toBe(true);
    });

    it('should not have params that it doesn\'t have', function() {
      expect(parsedParams.hasParameter('frobnotz')).toBe(false);
    });
  });

  describe('#getParameter', function() {
    it('should return the parameter values if params have values', function() {
      expect(parsedParams.getParameter('fiz')).toBe('buz');
    });

    it('should return boolean true for parameters without values', function() {
      expect(parsedParams.getParameter('baz')).toBe(true);
    });

    it('should return null for parameters it does not have', function() {
      expect(parsedParams.getParameter('frobnotz')).toBe(null);
    });
  });

  describe('#equals', function() {
    it('should equal itself', function() {
      expect(parsedParams.equals(parsedParams)).toBe(true);
    });

    it('should equal parsed params with the same parameters', function() {
      var otherParsedParams =
          new jssip.sip.protocol.ParsedParams(parsedParamArray);
      expect(parsedParams.equals(otherParsedParams)).toBe(true);
      expect(otherParsedParams.equals(parsedParams)).toBe(true);
    });

    it('should equal parsed params with the same out of order parameters',
       function() {
         var outOfOrderParamArray = [[';', ['baz']], [';', ['fiz', '=', 'buz']]];
         var otherParsedParams =
             new jssip.sip.protocol.ParsedParams(outOfOrderParamArray);
         expect(parsedParams.equals(otherParsedParams)).toBe(true);
         expect(otherParsedParams.equals(parsedParams)).toBe(true);
       });

    it('should not equal parsed params with different params', function() {
      var otherParsedParams = new jssip.sip.protocol.ParsedParams([]);
      expect(parsedParams.equals(otherParsedParams)).toBe(false);
      expect(otherParsedParams.equals(parsedParams)).toBe(false);
    });
  });

  describe('#stringify', function() {
    it('stringifies the parameter set', function() {
      expect(parsedParams.stringify()).toBe(';fiz=buz;baz');
    });

    it('serializes an empty string for empty parameters', function() {
      expect(new jssip.sip.protocol.ParsedParams([]).stringify()).toBe('');
    });
  });
});
