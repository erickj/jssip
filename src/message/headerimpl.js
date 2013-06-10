goog.provide('jssip.message.HeaderImpl');

goog.require('jssip.message.Header');
goog.require('jssip.util.PropertyHolder');



/**
 * @param {string} headerName
 * @param {string} rawValue
 * @param {!Array} parsedValue
 * @constructor
 * @implements {jssip.message.Header}
 */
jssip.message.HeaderImpl = function(headerName, rawValue, parsedValue) {
  var propertyMap = {};
  propertyMap[jssip.message.HeaderImpl.PropertyName_.HEADER_NAME] = headerName;
  propertyMap[jssip.message.HeaderImpl.PropertyName_.RAW_VALUE] = rawValue;
  propertyMap[
      jssip.message.HeaderImpl.PropertyName_.PARSED_VALUE] = parsedValue;

  /** @private {!jssip.util.PropertyHolder} */
  this.propertyHolder_ = new jssip.util.PropertyHolder(propertyMap);
};


/**
 * @enum {string}
 * @private
 */
jssip.message.HeaderImpl.PropertyName_ = {
  HEADER_NAME: 'hdr-name',
  RAW_VALUE: 'hdr-rawvalue',
  PARSED_VALUE: 'hdr-parsedvalue'
};


/** @override */
jssip.message.HeaderImpl.prototype.getHeaderName = function() {
  return /** @type {string} */ (this.propertyHolder_.get(
      jssip.message.HeaderImpl.PropertyName_.HEADER_NAME));
};


/** @override */
jssip.message.HeaderImpl.prototype.getRawValue = function() {
  return /** @type {string} */ (this.propertyHolder_.get(
      jssip.message.HeaderImpl.PropertyName_.RAW_VALUE));
};


/** @override */
jssip.message.HeaderImpl.prototype.getParsedValue = function() {
  return /** @type {!Array} */ (this.propertyHolder_.get(
      jssip.message.HeaderImpl.PropertyName_.PARSED_VALUE));
};
