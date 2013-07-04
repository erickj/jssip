goog.provide('jssip.sip.protocol.Route');



/**
 * @param {!jssip.sip.protocol.NameAddr} nameAddr
 * @constructor
 */
jssip.sip.protocol.Route = function(nameAddr) {
  /** @private {!jssip.sip.protocol.NameAddr} */
  this.nameAddr_ = nameAddr;
};


/**
 * @const {string}
 * @private
 */
jssip.sip.protocol.Route.Param = {
  LOOSE_ROUTING: 'lr'
};


/**
 * Whether or not this is a loose route.
 * @return {boolean}
 */
jssip.sip.protocol.Route.prototype.isLooseRoute = function() {
  return this.nameAddr_.getContextParams().hasParameter(
      jssip.sip.protocol.Route.Param.LOOSE_ROUTING);
};
