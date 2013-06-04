goog.provide('jssip.sip.plugin.core.DialogFeature');

goog.require('jssip.plugin.AbstractFeature');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.plugin.core.DialogFeature = function(name) {
  goog.base(this, name);
};
goog.inherits(
    jssip.sip.plugin.core.DialogFeature, jssip.plugin.AbstractFeature);
