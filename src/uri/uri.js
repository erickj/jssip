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
  if (!this.get(jssip.uri.Uri.PropertyName.HOST)) {
    throw Error('Unable to set URI without a host');
  }
};
goog.inherits(jssip.uri.Uri, jssip.core.PropertyHolder);


/**
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


// TODO(erick): Should create a UriSerialier superclass and subclass with
// serializers for each known scheme.  Then instead of using uri.toString call
// Serializer#serialize(uri), and dispatch based on URI scheme.
/**
 * Turns a URI into a string.
 * @return {string} The serialized URI.
 */
jssip.uri.Uri.prototype.toString = function() {
  // TODO(erick): As soon as non sip(s) URIs are needed see note above.
  var scheme = this.get(jssip.uri.Uri.PropertyName.SCHEME);
  if (scheme != jssip.uri.Uri.Scheme.SIP &&
      scheme != jssip.uri.Uri.Scheme.SIPS) {
    throw Error('Dont know how to serialize scheme ' + scheme);
  }

  var str = this.get(jssip.uri.Uri.PropertyName.SCHEME) + ':';
  if (this.get(jssip.uri.Uri.PropertyName.USER)) {
    str += this.get(jssip.uri.Uri.PropertyName.USER);
    if (this.get(jssip.uri.Uri.PropertyName.PASSWORD)) {
      str += ':' + this.get(jssip.uri.Uri.PropertyName.PASSWORD);
    }
    str += '@';
  }

  str += this.get(jssip.uri.Uri.PropertyName.HOST);

  if (this.get(jssip.uri.Uri.PropertyName.PORT)) {
    str += ':' + this.get(jssip.uri.Uri.PropertyName.PORT);
  }
  if (this.get(jssip.uri.Uri.PropertyName.PARAMETERS)) {
    str += ';' + this.get(jssip.uri.Uri.PropertyName.PARAMETERS);
  }
  if (this.get(jssip.uri.Uri.PropertyName.HEADERS)) {
    str += '?' + this.get(jssip.uri.Uri.PropertyName.HEADERS);
  }

  return str;
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
