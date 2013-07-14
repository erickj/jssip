goog.provide('jssip.sip.protocol.MessageDestination');



/**
 * RFC 3263 specifies the process to locate a SIP server, the process leaves the
 * client with an IPAddress, port, and transport type.  Instances of thsi class
 * are immutable objects representing this result.
 * @see http://tools.ietf.org/html/rfc3263#section-4
 *
 * @param {!goog.net.IpAddress} ipAddress
 * @param {number} port
 * @param {jssip.net.Socket.Type} socketType
 * @constructor
 */
jssip.sip.protocol.MessageDestination =
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
jssip.sip.protocol.MessageDestination.prototype.getSocketType = function() {
  return this.socketType_;
};


/**
 * @return {!goog.net.IpAddress}
 */
jssip.sip.protocol.MessageDestination.prototype.getIpAddress = function() {
  return this.ipAddress_;
};


/**
 * @return {number}
 */
jssip.sip.protocol.MessageDestination.prototype.getPort = function() {
  return this.port_;
};


/**
 * @param {!Object} o
 * @return {boolean}
 */
jssip.sip.protocol.MessageDestination.prototype.equals = function(o) {
  if (!(o instanceof jssip.sip.protocol.MessageDestination)) {
    return false;
  }
  var otherMessageDestination =
      /** @type {!jssip.sip.protocol.MessageDestination} */ (o);
  return this.port_ == otherMessageDestination.port_ &&
      this.socketType_ == otherMessageDestination.socketType_ &&
      this.ipAddress_.equals(otherMessageDestination.ipAddress_);
};
