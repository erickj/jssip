goog.provide('jssip.sip.core.CorePlugin');


goog.require('jssip.plugin.AbstractPlugin');
goog.require('jssip.plugin.FeatureSet');
goog.require('jssip.sip.core.CoreFeature');
goog.require('jssip.sip.core.DialogFeature');
goog.require('jssip.sip.core.TransactionFeature');



/**
 * This plugin provides the core behaviors specified in RFC 3261, including:
 *
 *   Section 8.1: UAC Behavior
 *   Section 8.2: UAS Behavior
 *
 * @constructor
 * @extends {jssip.plugin.AbstractPlugin}
 */
jssip.sip.core.CorePlugin = function() {
  goog.base(this, jssip.sip.core.CorePlugin.NAME,
      jssip.sip.core.CorePlugin.featureSetFactory);
};
goog.inherits(jssip.sip.core.CorePlugin, jssip.plugin.AbstractPlugin);


/** @const {string} */
jssip.sip.core.CorePlugin.NAME = 'sipcore';


/**
 * Returns a feature name for this plugin namespace.
 * @param {string} featureSuffix
 * @return {string}
 */
jssip.sip.core.CorePlugin.makeFeatureName = function(featureSuffix) {
  return jssip.sip.core.CorePlugin.NAME + '.' + featureSuffix;
};


/** @enum {string} */
jssip.sip.core.CorePlugin.FeatureName = {
  CORE: jssip.sip.core.CorePlugin.makeFeatureName('core'),
  DIALOG: jssip.sip.core.CorePlugin.makeFeatureName('dialog'),
  TRANSACTION: jssip.sip.core.CorePlugin.makeFeatureName('transaction')
};


/** @return {!jssip.plugin.FeatureSet} */
jssip.sip.core.CorePlugin.featureSetFactory = function() {
  return new jssip.plugin.FeatureSet([
    new jssip.sip.core.CoreFeature(
        jssip.sip.core.CorePlugin.FeatureName.CORE),
    new jssip.sip.core.DialogFeature(
        jssip.sip.core.CorePlugin.FeatureName.DIALOG),
    new jssip.sip.core.TransactionFeature(
        jssip.sip.core.CorePlugin.FeatureName.TRANSACTION)
  ]);
};
