goog.provide('jssip.sip.protocol.RouteSet');



/**
 * @param {!Array.<!jssip.sip.protocol.NameAddr>} routes
 * @constructor
 */
jssip.sip.protocol.RouteSet = function(routes) {
  /** @private {!Array.<!jssip.sip.protocol.NameAddr>} */
  this.routes_ = routes;
};


/** @return {boolean} */
jssip.sip.protocol.RouteSet.prototype.isEmpty = function() {
  return this.routes_.length == 0;
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 * @return {!jssip.sip.protocol.RouteSet}
 */
jssip.sip.protocol.RouteSet.createFromMessageContext =
    function(messageContext) {
  return new jssip.sip.protocol.RouteSet([]);
};
