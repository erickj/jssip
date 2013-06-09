goog.provide('jssip.sip.protocol.RouteSet');



/**
 * @param {!Array.<string>} routes
 * @constructor
 */
jssip.sip.protocol.RouteSet = function(routes) {
  /** @private {!Array.<string>} */
  this.routes_ = routes;
};


/**
 * @param {!jssip.message.MessageContext} messageContext
 * @return {!jssip.sip.protocol.RouteSet}
 */
jssip.sip.protocol.RouteSet.createFromMessageContext =
    function(messageContext) {
  return new jssip.sip.protocol.RouteSet([]);
};
