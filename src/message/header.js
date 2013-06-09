goog.provide('jssip.message.Header');
goog.provide('jssip.message.Header.Builder');

goog.require('jssip.util.PropertyHolder');



/**
 * @param {!jssip.message.Header.Builder} builder
 * @constructor
 * @extends {jssip.util.PropertyHolder}
 */
jssip.message.Header = function(builder) {
  goog.base(this, builder.propertyMap_);

  if (!this.get(jssip.message.Header.PropertyName.NAME)) {
    throw Error('Missing required property NAME');
  }
  if (!this.get(jssip.message.Header.PropertyName.RAW_VALUE)) {
    throw Error('Missing required property RAW_VALUE');
  }
  if (!this.get(jssip.message.Header.PropertyName.PARSED_VALUE)) {
    throw Error('Missing required property PARSED_VALUE');
  }
};
goog.inherits(jssip.message.Header, jssip.util.PropertyHolder);


/** @enum {string} */
jssip.message.Header.PropertyName = {
  NAME: 'hdr-name',
  RAW_VALUE: 'hdr-rawvalue',
  PARSED_VALUE: 'hdr-parsedvalue'
};



/**
 * @constructor
 */
jssip.message.Header.Builder = function() {
  /** @private {!Object.<string>} */
  this.propertyMap_ = {};
};


/**
 * Adds a property to the map
 * @param {string} propertyName
 * @param {string} value
 * @return {!jssip.message.Header.Builder}
 */
jssip.message.Header.Builder.prototype.addPropertyPair =
    function(propertyName, value) {
  this.propertyMap_[propertyName] = value;
  return this;
};


/**
 * Builds a Header
 * @return { !jssip.message.Header}
 */
jssip.message.Header.Builder.prototype.build = function() {
  return new jssip.message.Header(this);
};
