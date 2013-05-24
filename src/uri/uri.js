goog.provide('jssip.uri.Uri');
goog.provide('jssip.uri.Uri.Builder');

goog.require('jssip.core.PropertyHolder');



/**
 * @param {!jssip.uri.Uri.Builder} builder
 * @constructor
 * @extends {jssip.core.PropertyHolder}
 */
jssip.uri.Uri = function(builder) {
  goog.base(this, builder.propertyMap_);

  if (!this.get(jssip.uri.Uri.PropertyName.SCHEME)) {
    throw Error('Unable to set URI without a scheme');
  }
};
goog.inherits(jssip.uri.Uri, jssip.core.PropertyHolder);


/**
 * @param {jssip.uri.Uri.PropertyName} propertyName
 * @override
 * @return {?string}
 */
jssip.uri.Uri.prototype.get = function(propertyName) {
  var val = goog.base(this, 'get', propertyName);
  return goog.isDefAndNotNull(val) ? /** @type {string} */ (val) : null;
};


/** @enum {string} */
jssip.uri.Uri.PropertyName = {
  HEADERS: 'headers',
  HOST: 'host',
  PASSWORD: 'password',
  PATH: 'path',
  PORT: 'port',
  PARAMETERS: 'parameters',
  SCHEME: 'scheme',
  USER: 'user'
};


/** @enum {string} */
jssip.uri.Uri.Scheme = {
  SIP: 'sip',
  SIPS: 'sips',
  TEL: 'tel'
};



/**
 * @constructor
 */
jssip.uri.Uri.Builder = function() {
  /** @private {!Object.<jssip.uri.Uri.PropertyName, string>} */
  this.propertyMap_ = {};
};


/**
 * Adds a property to the map.
 * @param {jssip.uri.Uri.PropertyName} propertyName
 * @param {string} value
 * @return {!jssip.uri.Uri.Builder}
 */
jssip.uri.Uri.Builder.prototype.addPropertyPair =
    function(propertyName, value) {
  this.propertyMap_[propertyName] = value;
  return this;
};


/**
 * Builds a URI.
 * @return {!jssip.uri.Uri}
 */
jssip.uri.Uri.Builder.prototype.build = function() {
  return new jssip.uri.Uri(this);
};
