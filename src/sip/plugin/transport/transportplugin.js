goog.provide('jssip.sip.plugin.transport.TransportPlugin');

goog.require('jssip.plugin.AbstractPlugin');
goog.require('jssip.plugin.FeatureSet');
goog.require('jssip.sip.plugin.transport.TransportLayerFeature');



/**
 * Creates a transport plugin given a socket factory registry and DNS resolver.
 * These platform specific implementations will be provided to instantiated
 * TransportFeatures.
 * @param {!jssip.net.SocketFactoryRegistry} socketFactoryRegistry
 * @param {!jssip.net.Resolver} resolver
 * @constructor
 */
jssip.sip.plugin.transport.TransportPlugin =
    function(socketFactoryRegistry, resolver) {
  /** @private {!jssip.net.SocketFactoryRegistry} */
  this.socketFactoryRegistry_ = socketFactoryRegistry;

  /** @private {!jssip.net.Resolver} */
  this.resolver_ = resolver;

  goog.base(this, jssip.sip.plugin.transport.TransportPlugin.NAME,
      goog.bind(this.createFeatureSet_, this));
};
goog.inherits(
    jssip.sip.plugin.transport.TransportPlugin, jssip.plugin.AbstractPlugin);


/** @const {string} */
jssip.sip.plugin.transport.TransportPlugin.NAME = 'transport';


/**
 * Returns a feature name for this plugin namespace.
 * @param {string} featureSuffix
 * @return {string}
 */
jssip.sip.plugin.transport.TransportPlugin.makeFeatureName =
    function(featureSuffix) {
  return jssip.sip.plugin.transport.TransportPlugin.NAME + '.' + featureSuffix;
};


/** @enum {string} */
jssip.sip.plugin.transport.TransportPlugin.FeatureName = {
  SERVER_LOCATE: jssip.sip.plugin.transport.TransportPlugin.makeFeatureName(
      'serverlocate'),
  TRANSPORT: jssip.sip.plugin.transport.TransportPlugin.makeFeatureName(
      'transport')
};


/**
 * @return {!jssip.plugin.FeatureSet}
 * @private
 */
jssip.sip.plugin.transport.TransportPlugin.prototype.createFeatureSet_ =
    function() {
  return new jssip.plugin.FeatureSet([
    new jssip.sip.plugin.transport.ServerLocateFeature(
        jssip.sip.plugin.transport.TransportPlugin.FeatureName.SERVER_LOCATE),
    new jssip.sip.plugin.transport.TransportLayerFeature(
        jssip.sip.plugin.transport.TransportPlugin.FeatureName.TRANSPORT,
        this.socketFactoryRegistry_, this.resolver_)
  ]);
};
