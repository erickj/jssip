goog.provide('jssip.message.Header');
goog.provide('jssip.message.Header.Builder');

goog.require('jssip.core.PropertyHolder');



/**
 * @param {!jssip.message.Header.Builder} builder
 * @constructor
 * @extends {jssip.core.PropertyHolder}
 */
jssip.message.Header = function(builder) {
  goog.base(this, builder.propertyMap_);

  if (!this.get(jssip.message.Header.PropertyName.NAME)) {
    throw Error('Missing required property name');
  }
};
goog.inherits(jssip.message.Header, jssip.core.PropertyHolder);


/** @enum {string} */
jssip.message.Header.PropertyName = {
  NAME: 'name',
  RAW_VALUE: 'raw_value'
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
