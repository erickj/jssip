goog.provide('jssip.sip.protocol.RouteSet');

goog.require('goog.array');
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
  return goog.array.clone(this.routes_);
};


/** @return {boolean} */
jssip.sip.protocol.RouteSet.prototype.isFirstRouteStrict = function() {
  return !this.isEmpty() && !this.routes_[0].isLooseRoute();
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
