goog.provide('jssip.message.Request');

goog.require('jssip.message.Message');



/**
 * See RFC 3261 Section 7.1 for a description of SIP Requests.
 * @param {string} method The request method.
 * @param {string} requestUri The request URI.
 * @param {string} sipVersion The SIP version string.
 * @constructor
 * @extends {jssip.message.Message}
 */
jssip.message.Request = function(method, requestUri, sipVersion) {
  goog.base(this);

  /**
   * @type {string}
   * @private
   */
  this.method_ = method;

  /**
   * @type {string}
   * @private
   */
  this.requestUri_ = requestUri;

  /**
   * @type {string}
   * @private
   */
  this.sipVersion_ = sipVersion;
};
goog.inherits(jssip.message.Request, jssip.message.Message);


/** @override */
jssip.message.Request.prototype.isRequest = function() {
  return true;
};
