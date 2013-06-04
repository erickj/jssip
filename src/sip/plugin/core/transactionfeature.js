goog.provide('jssip.sip.plugin.core.TransactionFeature');

goog.require('jssip.plugin.AbstractFeature');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.plugin.core.TransactionFeature = function(name) {
  goog.base(this, name);
};
goog.inherits(
    jssip.sip.plugin.core.TransactionFeature, jssip.plugin.AbstractFeature);
