goog.provide('jssip.message.Message');



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

 * @constructor
 */
jssip.message.Message = function() {
  /**
   * @type {!Object.<string, !Array.<string>>}
   * @private
   */
  this.rawHeaders_ = {};

  /**
   * @type {?string}
   * @private
   */
  this.rawBody_ = null;
};


/**
 * Sets the raw body text of the message.
 * @param {string} body The raw body.
 */
jssip.message.Message.prototype.setRawBody = function(body) {
  this.rawBody_ = body;
};


/**
 * Gets the raw body of the message.
 * @return {?string} The raw body text or null if none set.
 */
jssip.message.Message.prototype.getRawBody = function() {
  return this.rawBody_;
};


/**
 * Adds a raw header name value pair to the message. Each value indicates a
 * unique instance of the header. Most headers can combine values into a comma
 * separated list in a single header field, however there are exceptions.  See
 * the excerpt above from 7.3.1.
 * @param {string} name The raw header name.
 * @param {string} value The raw header value.
 */
jssip.message.Message.prototype.addRawHeader = function(name, value) {
  name = jssip.message.Message.normalizeHeaderName_(name);
  if (!this.rawHeaders_[name]) {
    this.rawHeaders_[name] = [];
  }
  this.rawHeaders_[name].push(
      jssip.message.Message.normalizeMultilineValues_(value));
};


/**
 * @param {string} name The header name.
 * @return {Array.<string>} The raw values for a header or null.
 */
jssip.message.Message.prototype.getRawHeaderValue = function(name) {
  name = jssip.message.Message.normalizeHeaderName_(name);
  return this.rawHeaders_[name] || null;
};


/**
 * @return {boolean} Whether the message is a request.  True indicates
 *     a request, false indicates a response.
 */
jssip.message.Message.prototype.isRequest = function() {
  return false;
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
