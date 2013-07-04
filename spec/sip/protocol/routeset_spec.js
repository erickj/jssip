goog.provide('jssip.sip.protocol.RouteSetSpec');

goog.require('jssip.sip.protocol.RouteSet');

describe('jssip.sip.protocol.RouteSet', function() {
  var emptyRouteSet;
  var routeSet;
  var routes;

  beforeEach(function() {
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
    it('should return equivalents of the routes', function() {
      expect(routeSet.getRoutes()).toEqual(routes);
    });

    it('should return an empty array if empty', function() {
      expect(emptyRouteSet.getRoutes()).toEqual([]);
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
