goog.provide('jssip.Endpoint');

goog.require('jssip.core.EventBus');
goog.require('jssip.core.UserAgent');
goog.require('jssip.sip.core.CorePlugin');



/**
 * An endpoint can have multiple user agents.
 * List of events fired in the order in which they fire;
 *
 *   Event.LOADSTART - fired when loading begins
 *   Event.LOADEND - fired after all user agents are loaded
 *
 * @param {!Array.<!jssip.plugin.Plugin>} plugins The plugins array.
 * @param {!Array.<!jssip.core.UserAgent.Config>} configs Each config
 *     generates a user agent for the endpoint.
 * @param {!jssip.net.TransportManager} transportManager
 * @constructor
 */
jssip.Endpoint = function(plugins, configs, transportManager) {
  /** @private {!jssip.core.EventBus} */
  this.eventBus_ = new jssip.core.EventBus();

  // TODO(erick): define a transport framework where a transport manager accepts
  // a SIP URI and message and handles dispatching the message via the appriate
  // transport protocol. Initial browser implementation will just be access to
  // the xhr/websocket library in use for network access. Future implementations
  // for server side could include UDP/TLS/SCTP transports.  The manager will
  // also supply messages to the endpoint from all open transports.
  /** @private {!jssip.net.TransportManager} */
  this.transportManager_ = transportManager;

  /** @private {!Array.<!jssip.core.UserAgent>} */
  this.userAgents_ = [];

  plugins.push(new jssip.sip.core.CorePlugin());
  for (var i = 0; i < configs.length; i++) {
    this.userAgents_.push(new jssip.core.UserAgent(
        plugins, configs[i], this.eventBus_, transportManager));
  }
};


/** @enum {string} */
jssip.Endpoint.Event = {
  LOADSTART: 'endpointloadstart',
  LOADEND: 'endpointloadend'
};


/**
 * Loads all user agents.
 */
jssip.Endpoint.prototype.load = function() {
  this.eventBus_.dispatchEvent(jssip.Endpoint.Event.LOADSTART);
  for (var i = 0; this.userAgents_.length; i++) {
    this.userAgents_[i].load();
  }
  this.eventBus_.dispatchEvent(jssip.Endpoint.Event.LOADEND);
};
