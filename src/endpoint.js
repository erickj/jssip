goog.provide('jssip.Endpoint');

goog.require('jssip.event.EventBus');
goog.require('jssip.sip.UserAgent');
goog.require('jssip.sip.plugin.core.CorePlugin');



/**
 * An endpoint can have multiple user agents.
 * List of events fired in the order in which they fire;
 *
 *   Event.LOADSTART - fired when loading begins
 *   Event.LOADEND - fired after all user agents are loaded
 *
 * @param {!Array.<!jssip.plugin.Plugin>} plugins The plugins array.
 * @param {!Array.<!jssip.sip.UserAgent.Config>} configs Each config
 *     generates a user agent for the endpoint.
 * @param {!jssip.platform.PlatformContext} platformContext
 * @constructor
 */
jssip.Endpoint = function(plugins, configs, platformContext) {
  /** @private {!jssip.event.EventBus} */
  this.eventBus_ = new jssip.event.EventBus();

  /** @private {!Array.<!jssip.sip.UserAgent>} */
  this.userAgents_ = [];

  plugins.push(new jssip.sip.plugin.core.CorePlugin());
  for (var i = 0; i < configs.length; i++) {
    this.userAgents_.push(new jssip.sip.UserAgent(
        plugins, configs[i], this.eventBus_, platformContext));
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


// TODO(erick): Move this to some export.js to only include during
// advanced compilation.  Also provide a facade to export instead of
// the actual object.
goog.exportSymbol('jssip.Endpoint', jssip.Endpoint);
goog.exportSymbol('jssip.Endpoint.prototype', jssip.Endpoint.prototype);
