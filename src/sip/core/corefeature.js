goog.provide('jssip.sip.core.CoreFeature');

goog.require('jssip.plugin.AbstractFeature');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.core.CoreFeature = function(name) {
  goog.base(this, [], name);
};
goog.inherits(jssip.sip.core.CoreFeature, jssip.plugin.AbstractFeature);
