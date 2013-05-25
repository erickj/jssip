goog.provide('jssip.sip.core.TransactionFeature');

goog.require('jssip.plugin.AbstractFeature');



/**
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.core.TransactionFeature = function(name) {
  goog.base(this, name);
};
goog.inherits(jssip.sip.core.TransactionFeature, jssip.plugin.AbstractFeature);
