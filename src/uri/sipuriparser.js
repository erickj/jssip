goog.provide('jssip.uri.SipUriParser');
goog.provide('jssip.uri.SipUriParserFactory');

goog.require('jssip.AbstractParser');
goog.require('jssip.uri.UriParser');
goog.require('jssip.uri.UriParserFactory');



/**
 * @constructor
 * @implements {jssip.uri.UriParserFactory}
 */
jssip.uri.SipUriParserFactory = function() {};


/**
 * @override
 * @return {!jssip.uri.SipParser} The SIP URI parser.
 */
jssip.uri.SipUriParserFactory.prototype.createParser = function(uri) {
  return new jssip.uri.SipParser(uri);
};



/**
 * @param {string} rawUri The URI to parse
 * @constructor
 * @implements {jssip.uri.UriParser}
 * @extends {jssip.AbstractParser}
 */
jssip.uri.SipUriParser = function(rawUri) {
  goog.base(this, rawUri);
};
goog.inherits(jssip.uri.SipUriParser, jssip.AbstractParser);


/**
 * @override
 * @return {!jssip.uri.Uri} The parsed URI.
 */
