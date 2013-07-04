goog.provide('jssip.sip.protocol.RouteSpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.Route');

describe('jssip.sip.protocol.RouteSet', function() {
  var looseRoute;
  var strictRoute;
  var mockControl;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();

    var looseParsedParams =
        new jssip.sip.protocol.ParsedParams([[';', ['lr']]]);
    var looseMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    looseMockNameAddr.getContextParams().
        $returns(looseParsedParams).$atMostOnce();
    looseRoute = new jssip.sip.protocol.Route(looseMockNameAddr);

    var strictParsedParams = new jssip.sip.protocol.ParsedParams([]);
    var strictMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    strictMockNameAddr.getContextParams().
        $returns(strictParsedParams).$atMostOnce();
    strictRoute = new jssip.sip.protocol.Route(strictMockNameAddr);
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
