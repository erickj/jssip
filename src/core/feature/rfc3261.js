goog.provide('jssip.core.feature.rfc3261');


/** @const {string} */
jssip.core.feature.rfc3261.SIP_VERSION = 'SIP/2.0';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.3}
 * @const {string}
 */
jssip.core.feature.rfc3261.DEFAULT_DISPLAY_NAME = 'Anonymous';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @const {string}
 */
jssip.core.feature.rfc3261.MAX_FORWARDS = '70';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.7}
 * @const {string}
 */
jssip.core.feature.rfc3261.BRANCH_ID_PREFIX = 'z9hG4bK';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-27.4}
 * @enum {string}
 */
jssip.core.feature.rfc3261.MethodType = {
  INVITE: 'INVITE',
  ACK: 'ACK',
  BYE: 'BYE',
  CANCEL: 'CANCEL',
  REGISTER: 'REGISTER',
  OPTIONS: 'OPTIONS',
  INFO: 'INFO'
};


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-20}
 * @enum {string}
 */
jssip.core.feature.rfc3261.HeaderType = {
  ACCEPT: 'Accept',
  ACCEPT_ENCODING: 'Accept-Encoding',
  ACCEPT_LANGUAGE: 'Accept-Language',
  ALERT_INFO: 'Alert-Info',
  ALLOW: 'Allow',
  AUTHENTICATION_INFO: 'Authentication-Info',
  AUTHORIZATION: 'Authorization',
  CALL_ID: 'Call-ID',
  CALL_INFO: 'Call-Info',
  CONTACT: 'Contact',
  CONTENT_DISPOSITION: 'Content-Disposition',
  CONTENT_ENCODING: 'Content-Encoding',
  CONTENT_LANGUAGE: 'Content-Language',
  CONTENT_LENGTH: 'Content-Length',
  CONTENT_TYPE: 'Content-Type',
  CSEQ: 'CSeq',
  DATE: 'Date',
  ERROR_INFO: 'Error-Info',
  EXPIRES: 'Expires',
  FROM: 'From',
  IN_REPLY_TO: 'In-Reply-To',
  MAX_FORWARDS: 'Max-Forwards',
  MIN_EXPIRES: 'Min-Expires',
  MIME_VERSION: 'MIME-Version',
  ORGANIZATION: 'Organization',
  PRIORITY: 'Priority',
  PROXY_AUTHENTICATE: 'Proxy-Authenticate',
  PROXY_AUTHORIZATION: 'Proxy-Authorization',
  PROXY_REQUIRE: 'Proxy-Require',
  RECORD_ROUTE: 'Record-Route',
  REPLY_TO: 'Reply-To',
  REQUIRE: 'Require',
  RETRY_AFTER: 'Retry-After',
  ROUTE: 'Route',
  SERVER: 'Server',
  SUBJECT: 'Subject',
  SUPPORTED: 'Supported',
  TIMESTAMP: 'Timestamp',
  TO: 'To',
  UNSUPPORTED: 'Unsupported',
  USER_AGENT: 'User-Agent',
  VIA: 'Via',
  WARNING: 'Warning',
  WWW_AUTHENTICATE: 'WWW-Authenticate'
};


/** @enum {string} */
jssip.core.feature.rfc3261.CompactHeaderType = {
  CALL_ID: 'i',
  CONTACT: 'm',
  CONTENT_ENCODING: 'e',
  CONTENT_LENGTH: 'l',
  CONTENT_TYPE: 'c',
  FROM: 'f',
  SUBJECT: 's',
  SUPPORTED: 'k',
  TO: 't',
  VIA: 'v'
};
