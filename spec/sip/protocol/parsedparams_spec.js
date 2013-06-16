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

    it('should return undefined for parameters it does not have', function() {
      expect(parsedParams.getParameter('frobnotz')).toBe(undefined);
    });
  });
});
