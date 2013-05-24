goog.provide('jssip.sip.core.HeaderParser');
goog.provide('jssip.sip.core.HeaderParserFactoryImpl');



/**
 * @constructor
 * @implements {jssip.message.HeaderParserFactory}
 */
jssip.sip.core.HeaderParserFactoryImpl = function() {};


/** @override */
jssip.sip.core.HeaderParserFactory.prototype.create = function() {
};


/**
 * @enum {string}
 */
jssip.sip.core.HeaderParser.HEADERS = {
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
