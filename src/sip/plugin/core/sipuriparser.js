goog.provide('jssip.sip.plugin.core.SipUriParser');
goog.provide('jssip.sip.plugin.core.SipUriParserFactory');

goog.require('jssip.parser.AbstractParser');
goog.require('jssip.parser.AbstractParserFactory');
goog.require('jssip.parser.ParseError');
goog.require('jssip.sip.grammar.rfc3261');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.UriParser');
goog.require('jssip.uri.UriParserFactory');



/**
 * Factory for building URI parsers.
 * @param {!jssip.event.EventBus} eventBus
 * @constructor
 * @implements {jssip.uri.UriParserFactory}
 * @extends {jssip.parser.AbstractParserFactory}
 */
jssip.sip.plugin.core.SipUriParserFactory = function(eventBus) {
  goog.base(this, eventBus);
};
goog.inherits(jssip.sip.plugin.core.SipUriParserFactory,
    jssip.parser.AbstractParserFactory);


/**
 * @override
 * @return {!jssip.uri.UriParser}
 */
jssip.sip.plugin.core.SipUriParserFactory.prototype.createParser =
    function(uri) {
  var parser = new jssip.sip.plugin.core.SipUriParser(uri);
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
jssip.sip.plugin.core.SipUriParser = function(rawUri) {
  goog.base(this, rawUri);

  /** @private {!jssip.uri.Uri.Builder} */
  this.builder_ = new jssip.uri.Uri.Builder();
};
goog.inherits(jssip.sip.plugin.core.SipUriParser, jssip.parser.AbstractParser);


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
jssip.sip.plugin.core.SipUriParser.regEx_ = new RegExp(
    '^(sip[s]?)[:]' +                   // scheme
    '(?:([^:@]*)(?:[:]([^@]*))?[@])?' + // user/password
    '([^:;?]+)' +                       // host
    '(?:[:]([\d]+))?' +                 // port
    '(?:[;]([^?]+))?' +                 // uri-parameters
    '(?:[?](.*))?$'                     // headers
    );


/** @private {!Array.<jssip.uri.Uri.PropertyName>} */
jssip.sip.plugin.core.SipUriParser.propertyNamePositionList_ = [
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
jssip.sip.plugin.core.SipUriParser.prototype.parse = function() {
  var rawSipUri = this.getRawText();
  var parts = rawSipUri.match(jssip.sip.plugin.core.SipUriParser.regEx_);
  if (!parts) {
    throw new jssip.parser.ParseError('Unable to parse SIP URI ' + rawSipUri);
  }

  var propertyPositionList =
      jssip.sip.plugin.core.SipUriParser.propertyNamePositionList_;
  for (var i = 1; i < propertyPositionList.length; i++) {
    if (parts[i]) {
      this.builder_.addPropertyPair(propertyPositionList[i], parts[i]);
    }
  }
  this.builder_.addUriParser(this);

  return this.builder_.build();
};


/** @override */
jssip.sip.plugin.core.SipUriParser.prototype.parseParameters =
    function(parameters) {
  var splitParameters = parameters.split(';');
  var result = {};
  for (var i = 0; i < splitParameters.length; i++) {
    var nameValuePair = splitParameters[i].split('=');
    if (nameValuePair.length == 0 || nameValuePair[0] == '') {
      continue;
    } else if (nameValuePair.length == 2) {
      result[nameValuePair[0]] = nameValuePair[1];
    } else if (nameValuePair.length == 1) {
      result[nameValuePair[0]] = true;
    } else {
      throw new jssip.parser.ParseError(
          'Unknown parameter value: ' + nameValuePair.toString());
    }
  }
  return result;
};
