goog.provide('jssip.uri.SipUriParser');
goog.provide('jssip.uri.SipUriParserFactory');

goog.require('jssip.parser.AbstractParser');
goog.require('jssip.parser.AbstractParserFactory');
goog.require('jssip.parser.ParseError');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');
goog.require('jssip.uri.UriParser');
goog.require('jssip.uri.UriParserFactory');



/**
 * Factory for building URI parsers.
 * @param {!goog.events.EventTarget} eventTarget The event target to use as the
 *     parent event target for created parsers.
 * @constructor
 * @implements {jssip.uri.UriParserFactory}
 * @extends {jssip.parser.AbstractParserFactory}
 */
jssip.uri.SipUriParserFactory = function(eventTarget) {
  goog.base(this, eventTarget);
};
goog.inherits(
    jssip.uri.SipUriParserFactory, jssip.parser.AbstractParserFactory);


/**
 * @override
 * @return {!jssip.uri.SipParser} The SIP URI parser.
 */
jssip.uri.SipUriParserFactory.prototype.createParser = function(uri) {
  var parser = new jssip.uri.SipUriParser(uri);
  this.setupParser(parser);
  return parser;
};



/**
 * From http://tools.ietf.org/html/rfc3261#section-19.1.1 the general form of
 * the SIP(S) URI is:
 *
 *  sip:user:password@host:port;uri-parameters?headers
 *
 * @param {string} rawUri
 * @constructor
 * @implements {jssip.uri.UriParser}
 * @extends {jssip.parser.AbstractParser}
 */
jssip.uri.SipUriParser = function(rawUri) {
  goog.base(this, rawUri);

  /** @private {!jssip.uri.Uri.Builder} */
  this.builder_ = new jssip.uri.Uri.Builder();
};
goog.inherits(jssip.uri.SipUriParser, jssip.parser.AbstractParser);


/**
 * The parts here will consist of:
 *   [0] - the match input
 *   [1] - scheme
 *   [2] - user
 *   [3] - password
 *   [4] - host
 *   [5] - port
 *   [6] - uri-parameters
 *   [7] - headers
 * @const
 * @private {!RegExp}
 */
jssip.uri.SipUriParser.regEx_ = new RegExp(
    '^(sip[s]?)[:]' +                   // scheme
    '(?:([^:@]*)(?:[:]([^@]*))?[@])?' + // user/password
    '([^:;?]+)' +                       // host
    '(?:[:]([\d]+))?' +                 // port
    '(?:[;]([^?]+))?' +                 // uri-parameters
    '(?:[?](.*))?$'                     // headers
    );


/** @private {!Array.<jssip.uri.Uri.PropertyName} */
jssip.uri.SipUriParser.propertyNamePositionList_ = [
  undefined,
  jssip.uri.Uri.PropertyName.SCHEME,
  jssip.uri.Uri.PropertyName.USER,
  jssip.uri.Uri.PropertyName.PASSWORD,
  jssip.uri.Uri.PropertyName.HOST,
  jssip.uri.Uri.PropertyName.PORT,
  jssip.uri.Uri.PropertyName.PARAMETERS,
  jssip.uri.Uri.PropertyName.HEADERS
];


/**
 * @override
 * @return {!jssip.uri.Uri} The parsed URI.
 * @throws {jssip.parser.ParseError}
 */
jssip.uri.SipUriParser.prototype.parse = function() {
  var rawSipUri = this.getRawText();
  var parts = rawSipUri.match(jssip.uri.SipUriParser.regEx_);
  if (!parts) {
    throw new jssip.parser.ParseError('Unable to parse SIP URI ' + rawSipUri);
  }

  var propertyPositionList = jssip.uri.SipUriParser.propertyNamePositionList_;
  for (var i = 1; i < propertyPositionList.length; i++) {
    if (parts[i]) {
      this.builder_.addPropertyPair(propertyPositionList[i], parts[i]);
    }
  }

  return this.builder_.build();
};
