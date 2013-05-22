goog.provide('jssip.plugin.Plugin');

/**
 * A plugin is the manner by which extensions are made to JSSIP.  Each
 * RFC implementation for instance probably warrants its own plugin. A
 * plugin can provide parsers for additional headers and URI schemes,
 * they can add processors for new method or header support, and can
 * expose new APIs to the endpoint.
 *
 * @interface
 */
jssip.plugin.Plugin = function() {
};


/**
 * Method called by the endpoint when an application registers a
 * plugin.
 * @param {!jssip.Endpoint} endpoint The endoint.
 */
jssip.plugin.Plugin.prototype.load = function(endpoint) {};


/**
 * Method called by the endpoint just prior to starting the
 * application.  This will be called after load, if plugin load was
 * successful.
 * @param {!jssip.Endpoint} endpoint The endoint.
 */
jssip.plugin.Plugin.prototype.start = function(endpoint) {};
