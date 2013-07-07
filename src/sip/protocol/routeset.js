goog.provide('jssip.sip.protocol.RouteSet');

goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.Route');


/**
 * @param {!Array.<!jssip.sip.protocol.Route>} routes
 * @constructor
 */
jssip.sip.protocol.RouteSet = function(routes) {
  /** @private {!Array.<!jssip.sip.protocol.Route>} */
  this.routes_ = routes;
};


/** @return {boolean} */
jssip.sip.protocol.RouteSet.prototype.isEmpty = function() {
  return this.routes_.length == 0;
};


/** @return {!Array.<!jssip.sip.protocol.Route} */
jssip.sip.protocol.RouteSet.prototype.getRoutes = function() {
  return this.routes_;
};


/** @return {boolean} */
jssip.sip.protocol.RouteSet.prototype.isFirstRouteStrict = function() {
  return !this.isEmpty() && !this.routes_[0].isLooseRoute();
};


/**
 * Shifts the first route off of the route set or throws if the route set is
 * empty.
 * @return {!jssip.sip.protocol.Route}
 * @throws {Error} if the route set is empty.
 */
jssip.sip.protocol.RouteSet.prototype.shift = function() {
  if (this.isEmpty()) {
    throw new Error('Route set is empty');
  }
  return this.routes_.shift();
};


/**
 * Pushes a route or name-addr onto the end of the route set. If a name-addr is
 * given it will be converted into a route.
 * @param {!(jssip.sip.protocol.Route|jssip.sip.protocol.NameAddr)} newRoute
 */
jssip.sip.protocol.RouteSet.prototype.push = function(newRoute) {
  if (newRoute instanceof jssip.sip.protocol.NameAddr) {
    newRoute = new jssip.sip.protocol.Route(newRoute);
  }
  this.routes_.push(newRoute);
};


/**
 * @param {!Array.<!jssip.sip.protocol.NameAddr} nameAddrs
 * @return {!jssip.sip.protocol.RouteSet}
 */
jssip.sip.protocol.RouteSet.createFromNameAddrs = function(nameAddrs) {
  var routes = [];
  for (var i = 0; i < nameAddrs.length; i++) {
    routes.push(new jssip.sip.protocol.Route(nameAddrs[i]));
  }
  return new jssip.sip.protocol.RouteSet(routes);
};
