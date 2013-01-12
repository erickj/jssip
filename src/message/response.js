goog.provide('jssip.message.Response');

goog.require('jssip.message.Message');



/**
 * See RFC 3261 Section 7.2 for a description of SIP Responses.
 * @param {string} sipVersion The SIP version string.
 * @param {string} statusCode The status code.
 * @param {string} reasonCode The reason code.
 * @constructor
 * @extends {jssip.message.Message}
 */
jssip.message.Response = function(sipVersion, statusCode, reasonCode) {
  goog.base(this);

  /**
   * @type {string}
   * @private
   */
  this.sipVersion_ = sipVersion;

  /**
   * @type {string}
   * @private
   */
  this.statusCode_ = statusCode;

  /**
   * @type {string}
   * @private
   */
  this.reasonCode_ = reasonCode;
};
goog.inherits(jssip.message.Response, jssip.message.Message);
