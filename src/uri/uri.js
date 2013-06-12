goog.provide('jssip.uri.Uri');
goog.provide('jssip.uri.Uri.Builder');

goog.require('goog.string');
goog.require('jssip.util.PropertyHolder');



/**
 * @param {!jssip.uri.Uri.Builder} builder
 * @constructor
 * @extends {jssip.util.PropertyHolder}
 */
jssip.uri.Uri = function(builder) {
  goog.base(this, builder.propertyMap_);

  /** @private {jssip.uri.UriParser} */
  this.uriParser_ = builder.uriParser_;

  /** @private {Object.<(string|boolean)>} */
  this.parsedParameters_ = null;

  if (!this.get(jssip.uri.Uri.PropertyName.SCHEME)) {
    throw Error('Unable to set URI without a scheme');
  }
  if (!this.get(jssip.uri.Uri.PropertyName.HOST)) {
    throw Error('Unable to set URI without a host');
  }
};
goog.inherits(jssip.uri.Uri, jssip.util.PropertyHolder);


/**
 * @override
 * @return {string}
 */
jssip.uri.Uri.prototype.get = function(propertyName) {
  var val = goog.base(this, 'get', propertyName);
  return goog.isDefAndNotNull(val) ? /** @type {string} */ (val) : '';
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


/** @return {string} */
jssip.uri.Uri.prototype.getHost = function() {
  return this.get(jssip.uri.Uri.PropertyName.HOST);
};


/** @return {string} */
jssip.uri.Uri.prototype.getScheme = function() {
  return this.get(jssip.uri.Uri.PropertyName.SCHEME);
};


// TODO(erick): Maybe use the uriParser_ to provide what the secure scheme is
// for this uri... and other values.  For instance an HTTP parser would indicate
// HTTPS as the secure protocol.
/** @return {boolean} */
jssip.uri.Uri.prototype.isSecure = function() {
  return this.getScheme() == jssip.uri.Uri.Scheme.SIPS;
};


/** @return {number} */
jssip.uri.Uri.prototype.getPort = function() {
  return goog.string.parseInt(this.get(jssip.uri.Uri.PropertyName.PORT));
};


/** @return {!Object.<(string|boolean)>} */
jssip.uri.Uri.prototype.getParameters = function() {
  if (!this.parsedParameters_) {
    if (!this.uriParser_) {
      throw Error('Unable to parse parameters without URI parser');
    }
    var params = this.get(jssip.uri.Uri.PropertyName.PARAMETERS);
    this.parsedParameters_ = params ?
        this.uriParser_.parseParameters(params) : {};
  }
  return this.parsedParameters_;
};


/**
 * Returns a parameters value or undefined.
 * @param {string} parameterName
 * @return {(string|boolean|undefined)}
 */
jssip.uri.Uri.prototype.getParameter = function(parameterName) {
  return this.getParameters()[parameterName];
};


/**
 * Returns true if the parameter name exists in this URI's parameter list,
 * regardless of value.
 * @param {string} parameterName
 * @return {boolean}
 */
jssip.uri.Uri.prototype.hasParameter = function(parameterName) {
  return goog.isDef(this.getParameter(parameterName));
};


// TODO(erick): Can reuse uriParser probably to reassemble this URI into a
// string.
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

  /** @private {jssip.uri.UriParser} */
  this.uriParser_ = null;
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
 * Adds the parser for this uri.
 * @param {!jssip.uri.UriParser} uriParser The parser to use for field specific
 *     parsing.
 * @return {!jssip.uri.Uri.Builder}
 */
jssip.uri.Uri.Builder.prototype.addUriParser = function(uriParser) {
  this.uriParser_ = uriParser;
  return this;
};


/**
 * Builds a URI.
 * @return {!jssip.uri.Uri}
 */
jssip.uri.Uri.Builder.prototype.build = function() {
  return new jssip.uri.Uri(this);
};
