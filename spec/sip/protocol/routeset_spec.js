goog.provide('jssip.sip.protocol.RouteSetSpec');

goog.require('goog.array');
goog.require('goog.testing.MockControl');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.Route');
goog.require('jssip.sip.protocol.RouteSet');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.sip.protocol.RouteSet', function() {
  var emptyRouteSet;
  var mockControl;
  var routeSet;
  var routes;
  var mockStrictRoute;
  var mockLooseRoute;

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();
    mockStrictRoute = mockControl.createLooseMock(
        jssip.sip.protocol.Route);
    mockStrictRoute.isLooseRoute().$returns(false).$anyTimes();

    mockLooseRoute = mockControl.createLooseMock(
        jssip.sip.protocol.Route);
    mockLooseRoute.isLooseRoute().$returns(true).$anyTimes();

    routes = [
      {}, {}, {}
    ];
    emptyRouteSet = new jssip.sip.protocol.RouteSet([]);
    routeSet = new jssip.sip.protocol.RouteSet(
        /** @type {!Array.<!jssip.sip.protocol.Route>} */ (routes));
  });

  describe('#isEmpty', function() {
    it('should not be empty for a route with routes', function() {
      expect(routeSet.isEmpty()).toBe(false);
    });

    it('should be empty for an empty route set', function() {
      expect(emptyRouteSet.isEmpty()).toBe(true);
    });
  });

  describe('#getRoutes', function() {
    it('returns a clone of its internal route list', function() {
      var routes = routeSet.getRoutes();
      expect(routes).not.toBe(routeSet.getRoutes());
      routes.push(1);
      expect(routeSet.getRoutes()).not.toContain(1);
    });

    it('should return equivalents of the routes', function() {
      expect(routeSet.getRoutes()).toEqual(routes);
    });

    it('should return an empty array if empty', function() {
      expect(emptyRouteSet.getRoutes()).toEqual([]);
    });
  });

  describe('#isFirstRouteStrict', function() {
    beforeEach(function() {
      mockControl.$replayAll();
    });

    afterEach(function() {
      mockControl.$verifyAll();
    });

    it('returns true if the first route is strict', function() {
      var routeSet = new jssip.sip.protocol.RouteSet(
          [mockStrictRoute]);
      expect(routeSet.isFirstRouteStrict()).toBe(true);
    });

    it('returns false if the first route is loose routed', function() {
      var routeSet = new jssip.sip.protocol.RouteSet(
          [mockLooseRoute]);
      expect(routeSet.isFirstRouteStrict()).toBe(false);
    });

    it('returns false if the route set is empty', function() {
      expect(emptyRouteSet.isFirstRouteStrict()).toBe(false);
    });
  });

  describe('.createFromNameAddrs', function() {
    var nameAddrs;

    beforeEach(function() {
      nameAddrs = [{}, {}, {}];
    });

    it('should create a RouteSet from a list of NameAddrs', function() {
      var routeSet = jssip.sip.protocol.RouteSet.createFromNameAddrs(
        /** @type {!Array.<!jssip.sip.protocol.NameAddr>} */ (nameAddrs));
      expect(routeSet).toEqual(jasmine.any(jssip.sip.protocol.RouteSet));

      var routes = routeSet.getRoutes();
      expect(routes.length).toBe(nameAddrs.length);
      for (var i = 0; i < routes.length; i++) {
        expect(routes[i]).toEqual(jasmine.any(jssip.sip.protocol.Route));
      }
    });
  });
});
