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
 * @enum {string}
 * @private
 */
jssip.sip.protocol.Route.Param_ = {
  LOOSE_ROUTING: 'lr'
};


/**
 * Gets the name addr for this Route.
 * @return {!jssip.sip.protocol.NameAddr}
 */
jssip.sip.protocol.Route.prototype.getNameAddr = function() {
  return this.nameAddr_;
};


/**
 * Whether or not this is a loose route.
 * @return {boolean}
 */
jssip.sip.protocol.Route.prototype.isLooseRoute = function() {
  return this.nameAddr_.getUri().hasParameter(
      jssip.sip.protocol.Route.Param_.LOOSE_ROUTING);
};


/** @return {string} */
jssip.sip.protocol.Route.prototype.stringify = function() {
  return this.nameAddr_.stringifyAsNameAddr();
};
