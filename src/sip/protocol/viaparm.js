goog.provide('jssip.sip.protocol.ViaParm');

goog.require('goog.asserts');
goog.require('jssip.sip.protocol.ParsedParams');



/**
 * A Via parm.
 *
 * @see {http://tools.ietf.org/html/rfc3261#section-20.42}
 * @param {string} protocol SIP by default
 * @param {string} version 2.0 by default
 * @param {string} transport TCP, UDP, TLS, etc...
 * @param {string} host The Via host
 * @param {string} port The port or empty string
 * @param {!jssip.sip.protocol.ParsedParams} params
 * @constructor
 */
jssip.sip.protocol.ViaParm = function(protocol, version, transport, host,
      port, params) {
  /** @private {string} */
  this.protocol_ = protocol;

  /** @private {string} */
  this.version_ = version;

  /** @private {string} */
  this.transport_ = transport;

  /** @private {string} */
  this.host_ = host;

  /** @private {string} */
  this.port_ = port;

  /** @private {!jssip.sip.protocol.ParsedParams} */
  this.params_ = params;
};


/** @return {string} */
jssip.sip.protocol.ViaParm.prototype.getTransport = function() {
  return this.transport_;
};


/** @return {string} */
jssip.sip.protocol.ViaParm.prototype.getHostPort = function() {
  return this.host_ + (this.port_ ? ':' + this.port_ : '');
};


/** @return {!jssip.sip.protocol.ParsedParams} */
jssip.sip.protocol.ViaParm.prototype.getParams = function() {
  return this.params_;
};


/** @return {?string} */
jssip.sip.protocol.ViaParm.prototype.getTtl = function() {
  var ttl = this.params_.getParameter('ttl');
  goog.asserts.assert(goog.isString(ttl) || goog.isNull(ttl));
  return ttl;
};


/** @return {?string} */
jssip.sip.protocol.ViaParm.prototype.getMaddr = function() {
  var maddr = this.params_.getParameter('maddr');
  goog.asserts.assert(goog.isString(maddr) || goog.isNull(maddr));
  return maddr;
};


/** @return {?string} */
jssip.sip.protocol.ViaParm.prototype.getReceived = function() {
  var received = this.params_.getParameter('received');
  goog.asserts.assert(goog.isString(received) || goog.isNull(received));
  return received;
};


/** @return {?string} */
jssip.sip.protocol.ViaParm.prototype.getBranch = function() {
  var branch = this.params_.getParameter('branch');
  goog.asserts.assert(goog.isString(branch) || goog.isNull(branch));
  return branch;
};


/**
 * Whether this is equal to another object.
 * @param {!Object} o
 * @return {boolean}
 */
jssip.sip.protocol.ViaParm.prototype.equals = function(o) {
  if (o === this) {
    return true;
  }
  if (!(o instanceof jssip.sip.protocol.ViaParm)) {
    return false;
  }
  var otherViaParm = /** @type {!jssip.sip.protocol.ViaParm} */ (o);
  return this.transport_ == otherViaParm.transport_ &&
      this.protocol_ == otherViaParm.protocol_ &&
      this.version_ == otherViaParm.version_ &&
      this.host_ == otherViaParm.host_ &&
      this.port_ == otherViaParm.port_ &&
      this.params_.equals(otherViaParm.params_);
};


/** @return {string} */
jssip.sip.protocol.ViaParm.prototype.stringify = function() {
  return [this.protocol_, '/', this.version_, '/', this.transport_,
    ' ', this.getHostPort(), this.params_.stringify()].join('');
};
