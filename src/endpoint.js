goog.provide('jssip.Endpoint');

goog.require('jssip.ParserRegistry');
goog.require('jssip.message.HeaderParserFactory')
goog.require('jssip.message.MessageParserFactory')
goog.require('jssip.net.TransportManager');
goog.require('jssip.plugin.Plugin')
goog.require('jssip.uri.UriParserFactory')

/**
 * @constructor
 */
jssip.Endpoint = function() {
  // TODO(erick): define a transport framework where a transport manager accepts
  // a SIP URI and message and handles dispatching the message via the appriate
  // transport protocol. Initial browser implementation will just be access to
  // the xhr/websocket library in use for network access. Future implementations
  // for server side could include UDP/TLS/SCTP transports.  The manager will
  // also supply messages to the endpoint from all open transports.
  /**
   * @type {!jssip.net.TransportManager}
   * @private
   */
  this.transportManager_ = new jssip.net.TransportManager();

//  this.transportManager_.onReceiveMessage(
//      goog.bind(this.receiveMessageFromTransport, this));

  // TODO(erick): init a parser here, when a module is registered part of
  // the init process must be to provide the parser to the module to allow
  // extensions to the parser for custom headers, content types, etc...
  /**
   * @type {!jssip.ParserRegistry}
   * @private
   */
  this.parserRegistry_ = new jssip.ParserRegistry(
      new jssip.message.MessageParserFactory());
};


/** @return {!jssip.ParserRegistry} */
jssip.Endpoint.prototype.getParserRegistry = function() {
  return this.parserRegistry_;
};


/**
 * Receives a message from the transport manager and hands it off for parsing
 * and processing.
 * @param {string} message The message received.
 */
jssip.Endpoint.prototype.receiveMessageFromTransport = function(message) {
  // TODO(erick): all the message parsing and processing kick off.  Create some
  // kind of message context here that will be used to house the original
  // message, parsed values, and will be what is passed to modules.
};


// TODO(erick): As modules are registered to the endpoint each may provide new
// capabilities of it's service (extended Accept/Allow params etc.)  These
// capabilities should be read from the module and accessible via the endpoint.
// @see: file:pjsip/sip_endpoint.h fn:pjsip_endpt_get_capability
// TODO(erick): is a priority necessary?
/**
 * Registers plugins with the endpoint.
 * @param {!jssip.plugin.Plugin} plugin The plugin.
 */
jssip.Endpoint.prototype.registerPlugin = function(plugin) {
};
