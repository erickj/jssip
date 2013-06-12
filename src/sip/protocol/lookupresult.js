goog.provide('jssip.sip.protocol.LookupResult');



/**
 * RFC 3263 specifies the process to locate a SIP server, the process leaves the
 * client with an IPAddress, port, and transport type.  Instances of thsi class
 * are immutable objects representing this result.
 * @see http://tools.ietf.org/html/rfc3263#section-4
 * @param {!Array.goog.net.IpAddress} ipAddress
 * @param {number} port
 * @param {jssip.net.Socket.Type} socketType
 */
jssip.sip.protocol.LookupResult =
    function(ipAddress, port, socketType) {
  /** @private {!goog.net.IpAddress} */
  this.ipAddress_ = ipAddress;

  /** @private {number} */
  this.port_ = port;

  /** @private {jssip.net.Socket.Type} */
  this.socketType_ = socketType;
};


/**
 * @return {jssip.net.Socket.Type}
 */
jssip.sip.protocol.LookupResult.prototype.getSocketType = function() {
  return this.socketType_;
};


/**
 * @return {!goog.net.IpAddress}
 */
jssip.sip.protocol.LookupResult.prototype.getIpAddress = function() {
  return this.ipAddress_;
};


/**
 * @return {number}
 */
jssip.sip.protocol.LookupResult.prototype.getPort = function() {
  return this.port_;
};
