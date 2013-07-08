goog.provide('jssip.sip.protocol.RouteSpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.Route');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.sip.protocol.RouteSet', function() {
  var looseRoute;
  var strictRoute;
  var mockControl;
  var looseMockNameAddr;
  var strictMockNameAddr;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();

    var looseMockUri = mockControl.createLooseMock(jssip.uri.Uri);
    looseMockUri.hasParameter('lr').$returns(true).$anyTimes();
    looseMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    looseMockNameAddr.getUri().
        $returns(looseMockUri).$atMostOnce();
    looseRoute = new jssip.sip.protocol.Route(looseMockNameAddr);

    var strictMockUri = mockControl.createLooseMock(jssip.uri.Uri);
    strictMockUri.hasParameter('lr').$returns(false).$anyTimes();
    strictMockNameAddr = mockControl.createStrictMock(
        jssip.sip.protocol.NameAddr);
    strictMockNameAddr.getUri().
        $returns(strictMockUri).$atMostOnce();
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

  describe('#stringify', function() {
    var uri = (new jssip.uri.Uri.Builder()).
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'strict.route').
        addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS, 'lr').
        build();

    it('stringifies as a name-addr as an addr-spec', function() {
      var route =
          new jssip.sip.protocol.Route(new jssip.sip.protocol.NameAddr(uri));
      expect(route.stringify()).toBe('<sip:strict.route;lr>');
    });
  });
});
