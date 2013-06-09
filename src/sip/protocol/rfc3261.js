goog.provide('jssip.sip.protocol.rfc3261');


/** @const {string} */
jssip.sip.protocol.rfc3261.SIP_VERSION = 'SIP/2.0';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.3}
 * @const {string}
 */
jssip.sip.protocol.rfc3261.DEFAULT_DISPLAY_NAME = 'Anonymous';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.5}
 * @const {string}
 */
jssip.sip.protocol.rfc3261.MAX_FORWARDS = '70';


/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.1.7}
 * @const {string}
 */
jssip.sip.protocol.rfc3261.BRANCH_ID_PREFIX = 'z9hG4bK';


/**
 * @suppress {missingProvide}
 * @see {http://tools.ietf.org/html/rfc3261#section-27.4}
 * @enum {string}
 */
jssip.sip.protocol.rfc3261.MethodType = {
  INVITE: 'INVITE',
  ACK: 'ACK',
  BYE: 'BYE',
  CANCEL: 'CANCEL',
  REGISTER: 'REGISTER',
  OPTIONS: 'OPTIONS',
  INFO: 'INFO'
};


/**
 * @suppress {missingProvide}
 * @see {http://tools.ietf.org/html/rfc3261#section-20}
 * @enum {string}
 */
jssip.sip.protocol.rfc3261.HeaderType = {
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


/**
 * @suppress {missingProvide}
 * @enum {string}
 */
jssip.sip.protocol.rfc3261.CompactHeaderType = {
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


/**
 * @suppress {missingProvide}
 * @see http://tools.ietf.org/html/rfc3261#section-21
 * @enum {string}
 */
jssip.sip.protocol.rfc3261.ResponseClass = {
  '1xx': 'provisional',
  '2xx': 'successful',
  '3xx': 'redirection',
  '4xx': 'request-failure',
  '5xx': 'server-failure',
  '6xx': 'global-failure'
};


/**
 * @suppress {missingProvide}
 * @see http://tools.ietf.org/html/rfc3261#section-25
 * @enum {string}
 */
jssip.sip.protocol.rfc3261.ResponseCode = {
  100: 'Trying',
  180: 'Ringing',
  181: 'Call Is Being Forwarded',
  182: 'Queued',
  183: 'Session Progress',

  200: 'OK',

  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Moved Temporarily',
  305: 'Use Proxy',
  380: 'Alternative Service',

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  410: 'Gone',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Unsupported URI Scheme',
  420: 'Bad Extension',
  421: 'Extension Required',
  423: 'Interval Too Brief',
  480: 'Temporarily not available',
  481: 'Call Leg/Transaction Does Not Exist',
  482: 'Loop Detected',
  483: 'Too Many Hops',
  484: 'Address Incomplete',
  485: 'Ambiguous',
  486: 'Busy Here',
  487: 'Request Terminated',
  488: 'Not Acceptable Here',
  491: 'Request Pending',
  493: 'Undecipherable',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Server Time-out',
  505: 'SIP Version not supported',
  513: 'Message Too Large',

  600: 'Busy Everywhere',
  603: 'Decline',
  604: 'Does not exist anywhere',
  606: 'Not Acceptable'
};
