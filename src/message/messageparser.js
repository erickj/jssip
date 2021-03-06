goog.provide('jssip.message.MessageParser');
goog.provide('jssip.message.MessageParserFactory');

goog.require('goog.string');
goog.require('jssip.message.Message');
goog.require('jssip.parser.AbstractParser');
goog.require('jssip.parser.AbstractParserFactory');
goog.require('jssip.parser.ParseError');
goog.require('jssip.util.AnyTokenMatcher');
goog.require('jssip.util.RegexpTokenMatcher');



/**
 * Factory for building message parsers.
 * @param {!goog.events.EventTarget} eventTarget The event target to use as the
 *     parent event target for created parsers.
 * @constructor
 * @extends {jssip.parser.AbstractParserFactory}
 */
jssip.message.MessageParserFactory = function(eventTarget) {
  goog.base(this, eventTarget);
};
goog.inherits(
    jssip.message.MessageParserFactory, jssip.parser.AbstractParserFactory);


/**
 * @override
 * @return {!jssip.message.MessageParser} The parser.
 */
jssip.message.MessageParserFactory.prototype.createParser = function(text) {
  var parser = new jssip.message.MessageParser(text);
  this.setupParser(parser);
  return parser;
};



/**
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
 * @extends {jssip.parser.AbstractParser}
 */
jssip.message.MessageParser = function(rawMessageText) {
  goog.base(this, rawMessageText);

  /**
   * @private {!jssip.message.Message.Builder}
   */
  this.messageBuilder_ = new jssip.message.Message.Builder();
};
goog.inherits(jssip.message.MessageParser, jssip.parser.AbstractParser);


/**
 * @enum {!jssip.util.TokenMatcher}
 * @private
 */
jssip.message.MessageParser.TOKEN_MATCHERS_ = {
  METHOD: new jssip.util.RegexpTokenMatcher(/^[a-zA-Z\d\-.!%*_+`'~]+$/),
  // A primitive matcher for what is needed at this level
  REQUEST_URI: new jssip.util.AnyTokenMatcher([
    new jssip.util.RegexpTokenMatcher(/^sip[s]?:.*$/),
    // absolute URI matcher
    new jssip.util.RegexpTokenMatcher(/^[a-zA-Z][a-zA-Z\d+\-.]*:.*$/)
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
 * @override
 * @return {!jssip.message.Message} The parsed message object.
 */
jssip.message.MessageParser.prototype.parse = function() {
  this.parseStartLine_();
  this.parseHeaders_();
  this.parseCrlf_();
  this.parseBody_();

  return this.messageBuilder_.build();
};


/**
 * Parse the start line.
 * @throws {jssip.parser.ParseError}
 * @private
 */
jssip.message.MessageParser.prototype.parseStartLine_ = function() {
  var startLine = this.readNextLine();
  var tokens = startLine.split(/\s+/);

  if (jssip.message.MessageParser.TOKEN_MATCHERS_.CR_OR_LF.test(startLine)) {
    throw new jssip.parser.ParseError('Invalid \n or \r in start line');
  }

  if (this.testRequestLineTokens_(tokens)) {
    this.messageBuilder_.
        setMethod(tokens[0]).
        setRequestUri(tokens[1]).
        setSipVersion(tokens[2]);
  } else if (this.testStatusLineTokens_(tokens)) {
    this.messageBuilder_.
        setSipVersion(tokens[0]).
        setStatusCode(tokens[1]).
        setReasonPhrase(tokens[2]);
  } else {
    throw new jssip.parser.ParseError('Unable to parse start line');
  }
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

 * @throws {jssip.parser.ParseError}
 * @private
 */
jssip.message.MessageParser.prototype.parseHeaders_ = function() {
  var line;
  // In order to match header values across multiple lines I need to the use
  // [\s\S] character class instead of just (.*).  In regular expressions '.'
  // does not match new lines, and javascript does not implement the DOTALL
  // regex mode.  This has nothing to do with the multiline regex modifier.
  // http://www.regular-expressions.info/dot.html
  var colonRegex = /([^:]+):([\s\S]*)/;
  var headers = [];
  var eof = false;

  // 'line' is all text from the current position to the next CRLF. 'line' may
  // contain newlines.
  while ((line = this.readNextLine()) != '') {
    if (line === null) {
      throw new jssip.parser.ParseError('Reading header line returned null');
    }

    // A regex is easier than splitting on colons. Another colon may
    // be in the value, and the split function limit parameter is foobar.
    var matches = line.match(colonRegex);
    if (!matches || matches.length != 3) {
      this.dispatchParseEvent('Unable to parse malformed header: ' + line);
      continue;
    }
    var headerName = goog.string.trimRight(matches[1]);
    var headerValue = goog.string.trimLeft(matches[2]);
    this.messageBuilder_.setHeader(headerName, headerValue);
  }
};


/**
 * This is simply to validate the packet is well formed and the last
 * header is followed by a CRLF. Its absence may indicate a truncated
 * packet.
 * @throws
 * @private
 */
jssip.message.MessageParser.prototype.parseCrlf_ = function() {
  // This is kludge, but all I want to do is see that the last 4
  // characters are 2 CRLFs.
  var position = this.getPosition();
  var token = '\r\n\r\n';
  if (this.readSubstring(position - token.length, position) != token) {
    throw new jssip.parser.ParseError(
        'Missing CRLF after headers. Packet may be truncated.');
  }
};


/**
 * Parses the message body out of the text and adds it to the message builder.
 * @private
 */
jssip.message.MessageParser.prototype.parseBody_ = function() {
  this.messageBuilder_.setBody(
      this.isEof() ? null : this.readSubstring(this.getPosition()));
};


/**
 * @param {!Array.<string>} tokens The tokens to test.
 * @return {boolean} Whether the tokens are part of a request line.
 * @private
 */
jssip.message.MessageParser.prototype.testRequestLineTokens_ =
    function(tokens) {
  var matchers = jssip.message.MessageParser.TOKEN_MATCHERS_;
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
jssip.message.MessageParser.prototype.testStatusLineTokens_ =
    function(tokens) {
  var matchers = jssip.message.MessageParser.TOKEN_MATCHERS_;
  return tokens.length == 3 &&
      matchers.SIP_VERSION.test(tokens[0]) &&
      matchers.STATUS_CODE.test(tokens[1]) &&
      matchers.REASON_PHRASE.test(tokens[2]);
};
