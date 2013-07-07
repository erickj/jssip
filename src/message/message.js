goog.provide('jssip.message.Message');
goog.provide('jssip.message.Message.Builder');

goog.require('goog.array');



/**
 * See RFC 3261 Section 7 for information about SIP messages.  In regards to the
 * ordering of headers @see Section 7.3.1:

7.3.1 Header Field Format

   ...

   Header fields can be extended over multiple lines by preceding each
   extra line with at least one SP or horizontal tab (HT).  The line
   break and the whitespace at the beginning of the next line are
   treated as a single SP character.  Thus, the following are
   equivalent:

      Subject: I know you're there, pick up the phone and talk to me!
      Subject: I know you're there,
               pick up the phone
               and talk to me!

   The relative order of header fields with different field names is not
   significant.  However, it is RECOMMENDED that header fields which are
   needed for proxy processing (Via, Route, Record-Route, Proxy-Require,
   Max-Forwards, and Proxy-Authorization, for example) appear towards
   the top of the message to facilitate rapid parsing.  The relative
   order of header field rows with the same field name is important.
   Multiple header field rows with the same field-name MAY be present in
   a message if and only if the entire field-value for that header field
   is defined as a comma-separated list (that is, if follows the grammar
   defined in Section 7.3).  It MUST be possible to combine the multiple
   header field rows into one "field-name: field-value" pair, without
   changing the semantics of the message, by appending each subsequent
   field-value to the first, each separated by a comma.  The exceptions
   to this rule are the WWW-Authenticate, Authorization, Proxy-
   Authenticate, and Proxy-Authorization header fields.  Multiple header
   field rows with these names MAY be present in a message, but since
   their grammar does not follow the general form listed in Section 7.3,
   they MUST NOT be combined into a single header field row.

   Implementations MUST be able to process multiple header field rows
   with the same name in any combination of the single-value-per-line or
   comma-separated value forms.

 * This constructor should not be used directly by any client
 * application code, the message parser is responsible for creating
 * new message objects. Messages are immutable.
 *
 * @param {!jssip.message.Message.Builder} builder The builder object
 *     to construct this message from.
 * @constructor
 */
jssip.message.Message = function(builder) {
  /**
   * @type {boolean}
   * @private
   */
  this.isRequest_ = builder.isRequest();

  /**
   * @type {string}
   * @private
   */
  this.method_ = this.isRequest_ ? builder.getMethod() : '';

  /**
   * @type {string}
   * @private
   */
  this.requestUri_ = this.isRequest_ ? builder.getRequestUri() : '';

  /**
   * @type {string}
   * @private
   */
  this.sipVersion_ = builder.getSipVersion();

  /**
   * @type {string}
   * @private
   */
  this.statusCode_ = !this.isRequest_ ? builder.getStatusCode() : '';

  /**
   * @type {string}
   * @private
   */
  this.reasonPhrase_ = !this.isRequest_ ? builder.getReasonPhrase() : '';

  /**
   * @type {?string}
   * @private
   */
  this.body_ = builder.getBody();

  /**
   * @type {!Object.<string, !Array.<string>>}
   * @private
   */
  this.headers_ = {};

  var headerMap = builder.getHeaders();
  for (var header in headerMap) {
    var valueList = headerMap[header];
    for (var i = 0; i < valueList.length; i++) {
      this.addRawHeader_(header, valueList[i]);
    };
  };
};


/** @return {boolean} Whether this is a request. False indicates a response. */
jssip.message.Message.prototype.isRequest = function() {
  return this.isRequest_;
};


/** @return {string} The method. */
jssip.message.Message.prototype.getMethod = function() {
  return this.method_;
};


/** @return {string} The requestUri. */
jssip.message.Message.prototype.getRequestUri = function() {
  return this.requestUri_;
};


/** @return {string} The sipVersion. */
jssip.message.Message.prototype.getSipVersion = function() {
  return this.sipVersion_;
};


/** @return {string} The statusCode. */
jssip.message.Message.prototype.getStatusCode = function() {
  return this.statusCode_;
};


/** @return {string} The reasonPhrase. */
jssip.message.Message.prototype.getReasonPhrase = function() {
  return this.reasonPhrase_;
};


/** @return {?string} The body or null if none set. */
jssip.message.Message.prototype.getBody = function() {
  return this.body_;
};


/**
 * @param {string} name The header name.
 * @return {Array.<string>} The raw values for a header or null.
 */
jssip.message.Message.prototype.getHeaderValue = function(name) {
  name = jssip.message.Message.normalizeHeaderName_(name);
  return this.headers_[name] || null;
};


/**
 * Adds a raw header name value pair to the message. Each value indicates a
 * unique instance of the header. Most headers can combine values into a comma
 * separated list in a single header field, however there are exceptions.  See
 * the excerpt above from 7.3.1.
 * @param {string} name The raw header name.
 * @param {string} value The raw header value.
 * @private
 */
jssip.message.Message.prototype.addRawHeader_ = function(name, value) {
  name = jssip.message.Message.normalizeHeaderName_(name);
  if (!this.headers_[name]) {
    this.headers_[name] = [];
  }
  this.headers_[name].push(
      jssip.message.Message.normalizeMultilineValues_(value));
};


// TODO(erick): eventually this /may/ be the place to convert from shortnames to
// long form names? I'm not really sure yet.
/**
 * Normalize a header name.
 * @param {string} name The header name.
 * @return {string} The normalized header name.
 * @private
 */
jssip.message.Message.normalizeHeaderName_ = function(name) {
  return name.toLowerCase();
};


/**
 * See the excerpt above from 7.3.1 on handling headers across multiple lines.
 * @param {string} value A header value.
 * @return {string} The value with newlines and trailing whitespace
 *     squeshed to a single space.
 * @private
 */
jssip.message.Message.normalizeMultilineValues_ = function(value) {
  return value.replace(/\n\s*/g, ' ');
};



/**
 * A message builder is created by the message parser and then used to
 * instantiate a message.  The values set in the message builder allow
 * for a single constructor to set the immutable values of the message
 * start line and indicate whether this message is a request or
 * response.  The builder validates the required fields are present
 * before instantiating a new message.
 * @constructor
 */
jssip.message.Message.Builder = function() {
  /**
   * @type {boolean}
   * @private
   */
  this.isRequest_ = false;

  /**
   * @type {string}
   * @private
   */
  this.method_ = '';

  /**
   * @type {string}
   * @private
   */
  this.requestUri_ = '';

  /**
   * @type {string}
   * @private
   */
  this.sipVersion_ = '';

  /**
   * @type {string}
   * @private
   */
  this.statusCode_ = '';

  /**
   * @type {string}
   * @private
   */
  this.reasonPhrase_ = '';

  /**
   * @type {?string}
   * @private
   */
  this.body_ = null;

  /** @private {!Object.<!Array.<string>>} */
  this.headerMap_ = {};
};


/** @return {boolean} Whether this is a request. */
jssip.message.Message.Builder.prototype.isRequest = function() {
  return this.isRequest_;
};


/** @return {string} The method. */
jssip.message.Message.Builder.prototype.getMethod = function() {
  return this.method_;
};


/** @return {string} The requestUri. */
jssip.message.Message.Builder.prototype.getRequestUri = function() {
  return this.requestUri_;
};


/** @return {string} The sipVersion. */
jssip.message.Message.Builder.prototype.getSipVersion = function() {
  return this.sipVersion_;
};


/** @return {string} The statusCode. */
jssip.message.Message.Builder.prototype.getStatusCode = function() {
  return this.statusCode_;
};


/** @return {string} The reasonPhrase. */
jssip.message.Message.Builder.prototype.getReasonPhrase = function() {
  return this.reasonPhrase_;
};


/** @return {?string} The body. */
jssip.message.Message.Builder.prototype.getBody = function() {
  return this.body_;
};


/** @return {!Object.<!Array.<string>>} The headers. */
jssip.message.Message.Builder.prototype.getHeaders = function() {
  return this.headerMap_;
};


/**
 * Set the method.
 * @param {string} method The method.
 * @return {!jssip.message.Message.Builder} Return this.
 * @throws {Error}
 */
jssip.message.Message.Builder.prototype.setMethod = function(method) {
  if (!!this.statusCode_ || !!this.reasonPhrase_) {
    throw new Error(
        'Unable to set method. Can not have request and response values');
  }
  this.method_ = method;
  return this;
};


/**
 * Set the requestUri.
 * @param {string} requestUri The requestUri.
 * @return {!jssip.message.Message.Builder} Return this.
 * @throws {Error}
 */
jssip.message.Message.Builder.prototype.setRequestUri = function(requestUri) {
  if (!!this.statusCode_ || !!this.reasonPhrase_) {
    throw new Error(
        'Unable to set request URI. Can not have request and response values');
  }
  this.requestUri_ = requestUri;
  return this;
};


/**
 * Set the sipVersion.
 * @param {string} sipVersion The sipVersion.
 * @return {!jssip.message.Message.Builder} Return this.
 */
jssip.message.Message.Builder.prototype.setSipVersion = function(sipVersion) {
  this.sipVersion_ = sipVersion;
  return this;
};


/**
 * Set the statusCode.
 * @param {string} statusCode The statusCode.
 * @return {!jssip.message.Message.Builder} Return this.
 * @throws {Error}
 */
jssip.message.Message.Builder.prototype.setStatusCode = function(statusCode) {
  if (!!this.method_ || !!this.requestUri_) {
    throw new Error(
        'Unable to set status code. Can not have request and response values');
  }
  this.statusCode_ = statusCode;
  return this;
};


/**
 * Set the reasonPhrase.
 * @param {string} reasonPhrase The reasonPhrase.
 * @return {!jssip.message.Message.Builder} Return this.
 * @throws {Error}
 */
jssip.message.Message.Builder.prototype.setReasonPhrase =
    function(reasonPhrase) {
  if (!!this.method_ || !!this.requestUri_) {
    throw new Error(
        'Unable to set reason. Can not have request and response values');
  }
  this.reasonPhrase_ = reasonPhrase;
  return this;
};


/**
 * Set the body.
 * @param {?string} body The body or null.
 * @return {!jssip.message.Message.Builder} Return this.
 */
jssip.message.Message.Builder.prototype.setBody = function(body) {
  this.body_ = body;
  return this;
};


/**
 * Sets a header key-value pair.  Multiple calls to this with the same key will
 * overwrite existing values.
 *
 * @param {string} key The header name.
 * @param {string|!Array.<string>} value A single value or value list.
 * @param {boolean=} opt_overwrite Whether to overwrite any existing values for
 *     the given header name or append.  The default is to append.
 * @return {!jssip.message.Message.Builder} Return this.
 */
jssip.message.Message.Builder.prototype.setHeader =
    function(key, value, opt_overwrite) {
  if (this.headerMap_[key] && !opt_overwrite) {
    this.headerMap_[key] = this.headerMap_[key].concat(value);
  } else {
    this.headerMap_[key] = goog.array.flatten(value);
  }
  return this;
};


/**
 * Builds a message object.
 * @return {!jssip.message.Message} The message.
 * @throws {Error}
 */
jssip.message.Message.Builder.prototype.build = function() {
  this.isRequest_ = !!this.method_ && !!this.requestUri_;

  if (this.isRequest_ && (!this.method_ || !this.requestUri_)) {
    throw new Error('Missing required value for request');
  } else if (!this.isRequest_ && !this.statusCode_) {
    throw new Error('Missing required values for response');
  } else if (!this.sipVersion_) {
    throw new Error('SIP Version not set');
  }

  return new jssip.message.Message(this);
};
