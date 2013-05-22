goog.provide('jssip.plugin.core.HeaderParser');
goog.provide('jssip.plugin.core.HeaderParserFactoryImpl');



/**
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 */
jssip.plugin.core.HeaderParserFactoryImpl = function() {};


/** @override */
jssip.plugin.core.HeaderParserFactory.prototype.create


/**
 * @enum {string}
 */
jssip.plugin.core.HeaderParser.HEADERS = {
  CALL_ID: 'call-id',
  CONTACT: 'contact',
  CONTENT_LENGTH: 'content-length',
  CONTENT_TYPE: 'content-type',
  CSEQ: 'cseq',
  FROM: 'from',
  MAX_FORWARDS: 'max-forwards',
  TO: 'to',
  RECORD_ROUTE: 'record-route',
  ROUTE: 'route',
  VIA: 'via'
};
