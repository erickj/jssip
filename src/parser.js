goog.provide('jssip.ParseError');
goog.provide('jssip.ParseWarning');
goog.provide('jssip.Parser');

goog.require('goog.string');
goog.require('jssip.message.Request');
goog.require('jssip.message.Response');
goog.require('jssip.util.Scanner');
goog.require('jssip.util.TokenMatcher');



/**
 * Custom error for parse errors. A parse error indicates the message
 * is grossly malformed and no further processing should be done on
 * the message.  Parse errors will be thrown during parsing and should
 * be caught.
 * @param {string} message The error message.
 * @constructor
 * @extends {Error}
 */
jssip.ParseError = function(message) {
  goog.base(this, message);
};
goog.inherits(jssip.ParseError, Error);



/**
 * Parse warnings are lower grade than parse errors, they indicate a
 * particular field is malformed but parsing of the message as a whole
 * can continue.  Parse warnings will be added to the message context.
 * @param {string} message The warning message.
 * @constructor
 */
jssip.ParseWarning = function(message) {
  /**
   * @type {string}
   */
  this.message = message;
};



/**
 * The main parser object used to parse SIP messages.
 * @constructor
 */
jssip.Parser = function() {
  /**
   * @type {!Object.<string,!jssip.message.HeaderParser>}
   * @private
   */
  this.headerParsers_ = {};

  /**
   * @type {!Object.<string,!jssip.uri.UriParser>}
   * @private
   */
  this.uriParsers_ = {};
};


/**
 * Parses a raw SIP message.
 * @param {string} rawMessageText The raw message text to parse.
 * @return {!jssip.message.Message} A parsed message object.
 */
jssip.Parser.prototype.parse = function(rawMessageText) {
  var messageParser = new jssip.Parser.MessageParser_(rawMessageText);
  return this.messageParser_.parse();
};


/**
 * Registers a new header type parser with this parser instance.
 * @param {string} headerName The header name to register.
 * @param {string} headerShortName  The short name.
 * @param {!jssip.message.HeaderParser} headerParser The parser.
 */
jssip.Parser.prototype.registerHeaderParser =
    function(headerName, headerShortName, headerParser) {
  headerName = headerName.toLowerCase();
  headerShortName = headerShortName.toLowerCase();

  if (this.headerParsers_[headerName]) {
    throw new Error('Already registered header parser for: ' + headerName);
  }
  if (this.headerParsers_[headerShortName]) {
    throw new Error('Already registered header parser for: ' + headerShortName);
  }

  this.headerParsers_[headerName] = headerParser;
  this.headerParsers_[headerShortName] = headerParser;
};


/**
 * Registers a new URI scheme parser with this parser instance.
 * @param {string} uriScheme The URI scheme.
 * @param {!jssip.uri.UriParser} uriParser The parser.
 */
jssip.Parser.prototype.registerUriParser =
    function(uriScheme, uriParser) {
  uriScheme = uriScheme.toLowerCase();

  if (this.uriParsers_[uriScheme]) {
    throw new Error('Already registered URI parser for: ' + uriScheme);
  }

  this.uriParsers_[uriScheme] = uriParser;
};



/***
 * Implementation of a generic message parser. The parser is meant to
 * be one and done, meaning one message parsing per instance.
 *
 * @see RFC 3261 Section 7:

   Both Request (section 7.1) and Response (section 7.2) messages use
   the basic format of RFC 2822 [3], even though the syntax differs in
   character set and syntax specifics.  (SIP allows header fields that
   would not be valid RFC 2822 header fields, for example.)  Both types
   of messages consist of a start-line, one or more header fields, an
   empty line indicating the end of the header fields, and an optional
   message-body.

         generic-message  =  start-line
                             *message-header
                             CRLF
                             [ message-body ]
         start-line       =  Request-Line / Status-Line

   The start-line, each message-header line, and the empty line MUST be
   terminated by a carriage-return line-feed sequence (CRLF).  Note that
   the empty line MUST be present even if the message-body is not.

  ...

7.1 Requests

   SIP requests are distinguished by having a Request-Line for a start-
   line.  A Request-Line contains a method name, a Request-URI, and the
   protocol version separated by a single space (SP) character.

   The Request-Line ends with CRLF.  No CR or LF are allowed except in
   the end-of-line CRLF sequence.  No linear whitespace (LWS) is allowed
   in any of the elements.

         Request-Line  =  Method SP Request-URI SP SIP-Version CRLF

 * Section 25, the ABNF for SIP defines a SIP method as on of
 * the predefined methods in 3261 or as a token, whith is defined as
 * follows;

  Method            =  INVITEm / ACKm / OPTIONSm / BYEm
                     / CANCELm / REGISTERm
                     / extension-method
  extension-method  =  token
  token             =  1*(alphanum / "-" / "." / "!" / "%" / "*"
                     / "_" / "+" / "`" / "'" / "~" )

  ...

7.2 Responses

   SIP responses are distinguished from requests by having a Status-Line
   as their start-line.  A Status-Line consists of the protocol version
   followed by a numeric Status-Code and its associated textual phrase,
   with each element separated by a single SP character.

   No CR or LF is allowed except in the final CRLF sequence.

      Status-Line  =  SIP-Version SP Status-Code SP Reason-Phrase CRLF

 *
 * @param {string} rawMessageText The raw message text to parse.
 * @constructor
 * @private
 */
jssip.Parser.MessageParser_ = function(rawMessageText) {
  /**
   * @type {string}
   * @private
   */
  this.rawMessageText_ = rawMessageText;

  /**
   * @type {!jssip.util.Scanner}
   * @private
   */
  this.scanner_ = new jssip.util.Scanner(rawMessageText);

  /**
   * @type {number}
   * @private
   */
  this.position_ = 0;

  /**
   * @type {!Array.<!jssip.ParseWarning>}
   */
  this.parseWarnings = [];
};


/**
 * @type {enum}
 * @private
 */
jssip.Parser.MessageParser_.TOKEN_MATCHERS_ = {
  METHOD: new jssip.util.RegexpTokenMatcher(/^[a-zA-Z\d-.!%*_+`'~]+$/),
  // A primitive matcher for what is needed at this level
  REQUEST_URI: new jssip.util.AnyTokenMatcher([
    new jssip.util.RegexpTokenMatcher(/^sip[s]?:.*$/),
    // absolute URI matcher
    new jssip.util.RegexpTokenMatcher(/^[a-zA-Z][a-zA-Z\d+-.]*:.*$/)
  ]),
  SIP_VERSION: new jssip.util.RegexpTokenMatcher(/^SIP\/[\d]\.[\d]$/),
  STATUS_CODE: new jssip.util.RegexpTokenMatcher(/^[123456][\d][\d]$/),
  REASON_PHRASE:
      new jssip.util.RegexpTokenMatcher(/[\n\r]/, true /* opt_rejectMatch */),
  CR_OR_LF: new jssip.util.AnyTokenMatcher([
    new jssip.util.RegexpTokenMatcher(/\n/),
    new jssip.util.RegexpTokenMatcher(/\r/)
  ])
};


/**
 * Read the next line from the scanner.
 * @return {?string} The next line or null if we've read everything.
 */
jssip.Parser.MessageParser_.prototype.readNextLine = function() {
  if (this.scanner_.isEof()) return null;

  var crlfPos = this.scanner_.nextTokenPosition(jssip.util.Scanner.TOKEN.CRLF);
  var line = this.scanner_.getSubstring(
      this.position_,
      this.scanner_.isEof() ? this.rawMessageText_.length : crlfPos);
  this.position_ = this.scanner_.getPosition();
  return line;
};


/**
 * Parse the raw message into its generic message type.
 * @return {!jssip.message.Message} The parsed message object.
 */
jssip.Parser.MessageParser_.prototype.parse = function() {
  var message = this.parseStartLine_();
  var headers = this.parseHeaders_();
  for (var i = 0; i < headers.length; i++) {
    // Header name/values are stored in even/odd positions of the
    // headers array.
    message.addRawHeader(headers[i], headers[++i]);
  }
  this.parseCrlf_();

  return message;
};


/**
 * Parse the start line.
 * @return {!jssip.message.Message} The parsed message object.
 * @throws
 * @private
 */
jssip.Parser.MessageParser_.prototype.parseStartLine_ = function() {
  var startLine = this.readNextLine();
  var tokens = startLine.split(/\s+/);
  var message;

  if (jssip.Parser.MessageParser_.TOKEN_MATCHERS_.CR_OR_LF.test(startLine)) {
    throw new jssip.ParseError('Invalid \n or \r in start line');
  }

  if (this.testRequestLineTokens_(tokens)) {
    message = new jssip.message.Request(tokens[0], tokens[1], tokens[2]);
  } else if (this.testStatusLineTokens_(tokens)) {
    message = new jssip.message.Response(tokens[0], tokens[1], tokens[2]);
  } else {
    throw new jssip.ParseError('Unable to parse start line');
  }
  return message;
};


/**
 * Parse the raw headers into an array of tuples.
 * @see RFC 3261 Section 7.3

7.3.1 Header Field Format

   Header fields follow the same generic header format as that given in
   Section 2.2 of RFC 2822 [3].  Each header field consists of a field
   name followed by a colon (":") and the field value.

      field-name: field-value

   The formal grammar for a message-header specified in Section 25
   allows for an arbitrary amount of whitespace on either side of the
   colon; however, implementations should avoid spaces between the field
   name and the colon and use a single space (SP) between the colon and
   the field-value.

      Subject:            lunch
      Subject      :      lunch
      Subject            :lunch
      Subject: lunch

   Thus, the above are all valid and equivalent, but the last is the
   preferred form.

 * @return {!Array<string>} Array of name, value pairs.
 * @throws
 * @private
 */
jssip.Parser.MessageParser_.prototype.parseHeaders_ = function() {
  var line;
  // In order to match header values across multiple lines I need to
  // the use [\s\S] character class instead of just (.*).  In regular
  // expressions . does not match new lines, and javascript does not
  // implement the DOTALL regex mode.  This has nothing to do with the
  // multiline regex modifier.
  var colonRegex = /([^:]+):([\s\S]*)/;
  var headers = [];
  var eof = false;

  while ((line = this.readNextLine()) != '') {
    if (line === null) {
      throw jssip.ParseError('Reading header line returned null');
    }

    // A regex is easier than splitting on colons. Another colon may
    // be in the value, and the split function limit parameter is foobar.
    var matches = line.match(colonRegex);
    if (!matches || matches.length != 3) {
      this.parseWarnings.push(
          new jssip.ParseWarning('Unable to parse malformed header: ' + line));
      continue;
    }
    headers.push(goog.string.trimRight(matches[1]));
    headers.push(goog.string.trimLeft(matches[2]));
  }
  return headers;
};


/**
 * This is simply to validate the packet is well formed and the last
 * header is followed by a CRLF. Its absence may indicate a truncated
 * packet.
 * @throws
 * @private
 */
jssip.Parser.MessageParser_.prototype.parseCrlf_ = function() {
  if (this.readNextLine() === null) {
    throw jssip.ParseError(
        'Missing CRLF after headers. Packet may be truncated.');
  }
};


/**
 * @param {!Array.<string>} tokens The tokens to test.
 * @return {boolean} Whether the tokens are part of a request line.
 * @private
 */
jssip.Parser.MessageParser_.prototype.testRequestLineTokens_ =
    function(tokens) {
  var matchers = jssip.Parser.MessageParser_.TOKEN_MATCHERS_;
  return tokens.length == 3 &&
      matchers.METHOD.test(tokens[0]) &&
      matchers.REQUEST_URI.test(tokens[1]) &&
      matchers.SIP_VERSION.test(tokens[2]);
};


/**
 * @param {!Array.<string>} tokens The tokens to test.
 * @return {boolean} Whether the tokens are part of a status line.
 * @private
 */
jssip.Parser.MessageParser_.prototype.testStatusLineTokens_ =
    function(tokens) {
  var matchers = jssip.Parser.MessageParser_.TOKEN_MATCHERS_;
  return tokens.length == 3 &&
      matchers.SIP_VERSION.test(tokens[0]) &&
      matchers.STATUS_CODE.test(tokens[1]) &&
      matchers.REASON_PHRASE.test(tokens[2]);
};
