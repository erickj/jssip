goog.provide('jssip.sip.plugin.transport.TransportPluginSpec');

goog.require('jssip.sip.plugin.transport.TransportPlugin');

describe('jssip.sip.plugin.transport.TransportPlugin', function() {
  var plugin;
  var socketFactoryRegistry;
  var resolver;
  var featureSpy;

  beforeEach(function() {
    // Spying on the creation of the TransportLayerFeature like this is fickle
    // risky business... injecting the feature constructors (factories?) into
    // the plugin might be better.
    featureSpy = jasmine.createSpy();
    jssip.sip.plugin.transport.TransportLayerFeature = featureSpy;
    goog.mixin(featureSpy.prototype, {
      getName: function() { return 'tranport layer spy'; }
    });

    socketFactoryRegistry =
        /** @type {!jssip.net.SocketFactoryRegistry} */ ({});
    resolver = /** @type {!jssip.net.Resolver} */ ({});
    plugin = new jssip.sip.plugin.transport.TransportPlugin(
        socketFactoryRegistry, resolver);
  });

  describe('#generateFeatureSet', function() {
    it('should pass the socketFactoryRegistry and resolver to the feature',
       function() {
         var featureSet = plugin.generateFeatureSet();
         expect(featureSpy).toHaveBeenCalledWith(
             jasmine.any(String), socketFactoryRegistry, resolver);
       });
  });
});
