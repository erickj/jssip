goog.provide('jssip.sip.core.DialogFeature');

goog.require('jssip.plugin.AbstractFeature');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.core.DialogFeature = function(name) {
  goog.base(this, [], name);
};
goog.inherits(jssip.sip.core.DialogFeature, jssip.plugin.AbstractFeature);
