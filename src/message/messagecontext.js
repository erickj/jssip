goog.provide('jssip.message.MessageContext');
goog.provide('jssip.message.ImmutableMessageContextError');

goog.require('jssip.message.HeaderImpl');
goog.require('jssip.parser.NoRegisteredHeaderParserError');



/**
 * @param {string} message
 * @constructor
 * @extends {Error}
 */
jssip.message.ImmutableMessageContextError = function(message) {
  this.message = message;
};
goog.inherits(jssip.message.ImmutableMessageContextError, Error);


/**
 * @param {jssip.message.MessageContext.Type} type
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @param {!jssip.sip.SipContext} sipContext
 * @constructor
 */
jssip.message.MessageContext = function(type, parserRegistry, sipContext) {
  /** @private {jssip.message.MessageContext.Type} */
  this.type_ = type;

  /** @private {jssip.message.Message} */
  this.cachedMessage_ = null;

  /** @private {!Object.<!Array.<!jssip.message.Header>>} */
  this.parsedHeaderCache_ = {};

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;

  /** @private {!jssip.sip.SipContext} */
  this.sipContext_ = sipContext;
};


/** @enum {string} */
jssip.message.MessageContext.Type = {
  RAW: 'raw',
  BUILDER: 'builder'
};


/**
 * Whether this message originates locally.
 * @return {boolean}
 */
jssip.message.MessageContext.prototype.isLocal = goog.abstractMethod;


/**
 * Sets a header on the message in this message context.
 *
 * NOTE: alternating calls to {@code #getMessage} or other methods that call
 * {@code #getMessage} with calls to {@code #setHeader} will create lots of
 * garbage collection overhead.
 *
 * @param {string} key The header name.
 * @param {string|!Array.<string>} value A single value or value list.
 * @param {boolean=} opt_overwrite Whether to overwrite any existing values for
 *     the given header name or append.  The default is to append.
 * @return {!jssip.message.MessageContext} Returns this.
 * @throws {jssip.message.MessageContext.ImmutableMessageContextError}
 */
jssip.message.MessageContext.prototype.setHeader =
    function(key, value, opt_overwrite) {
  this.clearCaches_();
  this.setHeaderInternal(key, value, opt_overwrite);
  return this;
};


/**
 * Internal implementation for setHeader to override by subclasses.
 * @param {string} key The header name.
 * @param {string|!Array.<string>} value A single value or value list.
 * @param {boolean=} opt_overwrite Whether to overwrite any existing values for
 *     the given header name or append.  The default is to append.
 * @throws {jssip.message.MessageContext.ImmutableMessageContextError}
 */
jssip.message.MessageContext.prototype.setHeaderInternal = goog.abstractMethod;


/**
 * Sets the request URI on mutable message contexts.
 * @param {string} requestUri
 * @return {!jssip.message.MessageContext} Returns this.
 * @throws {jssip.message.MessageContext.ImmutableMessageContextError}
 */
jssip.message.MessageContext.prototype.setRequestUri = function(requestUri) {
  this.clearCaches_();
  this.setRequestUriInternal(requestUri);
  return this;
};


/**
 * Internal implementation for setRequestUri to override by subclasses.
 * @param {string} requestUri
 * @throws {jssip.message.MessageContext.ImmutableMessageContextError}
 */
jssip.message.MessageContext.prototype.setRequestUriInternal =
    goog.abstractMethod;


/**
 * Clears all internally cached state.
 * @private
 */
jssip.message.MessageContext.prototype.clearCaches_ = function() {
  if (this.cachedMessage_) {
    this.cachedMessage_.dispose();
    this.cachedMessage_ = null;
  }
  this.parsedHeaderCache_ = {};
};


/**
 * @return {!jssip.parser.ParserRegistry}
 * @protected
 */
jssip.message.MessageContext.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/**
 * The protected getter for the message when it has not been set yet.
 * @return {!jssip.message.Message} The message object.
 * @protected
 */
jssip.message.MessageContext.prototype.getMessageInternal = goog.abstractMethod;


/**
 * Returns the message.  Lazily requests the message from
 * {@code getMessageInternal} on first access only.
 * @return {!jssip.message.Message} The message object.
 */
jssip.message.MessageContext.prototype.getMessage = function() {
  if (!this.cachedMessage_ || this.cachedMessage_.isDisposed()) {
    this.clearCaches_();
    this.cachedMessage_ = this.getMessageInternal();
  }
  return this.cachedMessage_;
};


/**
 * @return {boolean} Whether or not this is a message context for a request.
 */
jssip.message.MessageContext.prototype.isRequest = function() {
  return this.getMessage().isRequest();
};


/**
 * Returns the dialog associated with this message.
 * @return {jssip.sip.protocol.Dialog} The dialog.
 */
jssip.message.MessageContext.prototype.getDialog = function() {
  return this.sipContext_.getDialogStorage().getDialogForMessageContext(this);
};


/**
 * Returns the transaction associated with this message.
 * @return {!jssip.sip.protocol.Transaction} The transaction.
 */
jssip.message.MessageContext.prototype.getTransaction = function() {
  throw Error('Not implemented yet');
};


/**
 * Returns an array of headers that are present in the message.  Be aware that
 * each header's {@code #getParsedValue} method also returns an array of values.
 * This is to account for the ability of headers to appear multiple times in a
 * SIP message, each containing multiple comma (or other delimiting character)
 * separated values.
 *
 * @param {string} headerName
 * @return {!Array.<!jssip.message.Header>}
 */
jssip.message.MessageContext.prototype.getParsedHeader = function(headerName) {
  // TODO: Add some header name normalization logic here to make sure this only
  // caches the header once for long form and short form header names.
  if (!goog.isDef(this.parsedHeaderCache_[headerName])) {
    var message = this.getMessage();
    var headerValues = message.getHeaderValue(headerName);
    var parsedHeaderValues = [];
    if (headerValues != null) {
      try {
        for (var i = 0; i < headerValues.length; i++) {
          parsedHeaderValues.push(
              this.parserRegistry_.parseHeader(headerName, headerValues[i]));
        }
      } catch(e) {
        if (e instanceof jssip.parser.NoRegisteredHeaderParserError) {
          for (var i = 0; i < headerValues.length; i++) {
            parsedHeaderValues.push(new jssip.message.HeaderImpl(
                headerName, headerValues[i], [headerValues[i]]));
          }
        } else {
          throw e;
        }
      }
    }
    this.parsedHeaderCache_[headerName] = parsedHeaderValues;
  }
  return this.parsedHeaderCache_[headerName];
};
