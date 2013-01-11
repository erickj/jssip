goog.provide('jssip.message.Header');


/**
 * @param {string} name The header name
 * @param {string} vaue The header value
 */
jssip.message.Header = function(name, value) {
  /**
   * @type {string}
   * @private
   */
  this.name_ = name;

  /**
   * @type {string}
   * @private
   */
  this.value_ = value;
};


/**
 * @return {string} The header name.
 */
jssip.message.Header.prototype.getName = function() {
  return this.name_;
};


/**
 * @return {string} The raw unparsed header value.
 */
jssip.message.Header.prototype.getValue = function() {
  return this.value_;
};
