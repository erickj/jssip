goog.provide('jssip.sip.protocol.RouteSpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.Route');

describe('jssip.sip.protocol.RouteSet', function() {
  var looseRoute;
  var strictRoute;
  var mockControl;
  var looseMockNameAddr;
  var strictMockNameAddr;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();

    var looseParsedParams =
        new jssip.sip.protocol.ParsedParams([[';', ['lr']]]);
    looseMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    looseMockNameAddr.getContextParams().
        $returns(looseParsedParams).$atMostOnce();
    looseRoute = new jssip.sip.protocol.Route(looseMockNameAddr);

    var strictParsedParams = new jssip.sip.protocol.ParsedParams([]);
    strictMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    strictMockNameAddr.getContextParams().
        $returns(strictParsedParams).$atMostOnce();
    strictRoute = new jssip.sip.protocol.Route(strictMockNameAddr);
  });

  describe('#getNameAddr', function() {
    it('returns the name-addr for the route', function() {
      expect(looseRoute.getNameAddr()).toBe(looseMockNameAddr);
      expect(strictRoute.getNameAddr()).toBe(strictMockNameAddr);
    });
  });

  describe('#isLooseRoute', function() {
    beforeEach(function() {
      mockControl.$replayAll();
    });

    afterEach(function() {
      mockControl.$verifyAll();
    });

    it('should return true for loose routes', function() {
      expect(looseRoute.isLooseRoute()).toBe(true);
    });

    it('should return false for strict routes', function() {
      expect(strictRoute.isLooseRoute()).toBe(false);
    });
  });
});
