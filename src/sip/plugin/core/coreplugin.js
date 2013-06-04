goog.provide('jssip.sip.plugin.core.CorePlugin');


goog.require('jssip.plugin.AbstractPlugin');
goog.require('jssip.plugin.FeatureSet');
goog.require('jssip.sip.plugin.core.DialogFeature');
goog.require('jssip.sip.plugin.core.TransactionFeature');
goog.require('jssip.sip.plugin.core.UserAgentFeature');



/**
 * This plugin provides the core behaviors specified in RFC 3261, including:
 *
 *   Section 8.1: UAC Behavior
 *   Section 8.2: UAS Behavior
 *
 * @constructor
 * @extends {jssip.plugin.AbstractPlugin}
 */
jssip.sip.plugin.core.CorePlugin = function() {
  goog.base(this, jssip.sip.plugin.core.CorePlugin.NAME,
      jssip.sip.plugin.core.CorePlugin.featureSetFactory);
};
goog.inherits(jssip.sip.plugin.core.CorePlugin, jssip.plugin.AbstractPlugin);


/** @const {string} */
jssip.sip.plugin.core.CorePlugin.NAME = 'sipcore';


/**
 * Returns a feature name for this plugin namespace.
 * @param {string} featureSuffix
 * @return {string}
 */
jssip.sip.plugin.core.CorePlugin.makeFeatureName = function(featureSuffix) {
  return jssip.sip.plugin.core.CorePlugin.NAME + '.' + featureSuffix;
};


/** @enum {string} */
jssip.sip.plugin.core.CorePlugin.FeatureName = {
  USERAGENT: jssip.sip.plugin.core.CorePlugin.makeFeatureName('useragent'),
  DIALOG: jssip.sip.plugin.core.CorePlugin.makeFeatureName('dialog'),
  TRANSACTION: jssip.sip.plugin.core.CorePlugin.makeFeatureName('transaction')
};


/** @return {!jssip.plugin.FeatureSet} */
jssip.sip.plugin.core.CorePlugin.featureSetFactory = function() {
  return new jssip.plugin.FeatureSet([
    new jssip.sip.plugin.core.UserAgentFeature(
        jssip.sip.plugin.core.CorePlugin.FeatureName.USERAGENT),
    new jssip.sip.plugin.core.DialogFeature(
        jssip.sip.plugin.core.CorePlugin.FeatureName.DIALOG),
    new jssip.sip.plugin.core.TransactionFeature(
        jssip.sip.plugin.core.CorePlugin.FeatureName.TRANSACTION)
  ]);
};
