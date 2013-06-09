goog.provide('jssip.plugin.AbstractFeatureSpec');

goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.event.EventBus');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureContext');
goog.require('jssip.plugin.Feature.Event');
goog.require('jssip.testing.util.featureutil');

describe('jssip.plugin.AbstractFeature', function() {
  var name = 'test.abstractfeature';
  var feature;

  beforeEach(function() {
    feature = new jssip.plugin.AbstractFeature(name);
  });

  describe('inheritance', function() {
    it('should be an event bus', function() {
      expect(feature instanceof jssip.event.EventBus).toBe(true);
    });
  });

  describe('getters', function() {
    it('should get the name', function() {
      expect(feature.getName()).toBe(name);
    });

    describe('feature facade', function() {
      it('should throw on #getFeatureFacade if not set', function() {
        expect(function() { feature.getFeatureFacade(); }).toThrow();
      });

      it('should return the feature facade when set', function() {
        var featureFacade = {};
        feature =
            new jssip.plugin.AbstractFeature(name, featureFacade);
        expect(feature.getFeatureFacade()).toBe(featureFacade);
      });
    });
  });

  describe('#activate', function() {
    var eventHandlerMap = {};
    var featureTypes = ['amazing', 'spectacular'];
    var headers = ['h1', 'h2'];
    var uriSchemes = ['u1', 'u2'];
    var parserRegistry;
    var featureContext;
    var eventBus;

    beforeEach(function() {
      eventHandlerMap['listen.test1'] = {};
      eventHandlerMap['listen.test2'] = {};

      feature = new jssip.plugin.AbstractFeature(name, undefined,
          eventHandlerMap, featureTypes, headers, uriSchemes);
      feature.getHeaderParserFactory = jasmine.createSpy();
      feature.getUriParserFactory = jasmine.createSpy();

      eventBus = {
        addEventListener: jasmine.createSpy(),
        getParentEventTarget: function() {}
      }
      featureContext =
          jssip.testing.util.featureutil.createFeatureContext(eventBus);
      parserRegistry = featureContext.getParserRegistry();
    });

    it('should not be active until activated', function() {
      expect(feature.isActive()).toBe(false);
      feature.activate(featureContext);
      expect(feature.isActive()).toBe(true);

      // it should throw if activated again
      expect(function() {
        feature.activate(featureContext);
      }).toThrow();
    });

    it('should register event handlers', function() {
      expect(eventBus.addEventListener).not.toHaveBeenCalled();
      feature.activate(featureContext);
      expect(eventBus.addEventListener).toHaveBeenCalledWith(
          'listen.test1', eventHandlerMap['listen.test1']);
      expect(eventBus.addEventListener).toHaveBeenCalledWith(
          'listen.test2', eventHandlerMap['listen.test2']);
    });


    it('should setup the event chain on activation', function() {
      expect(feature.getParentEventTarget()).toBe(null);
      feature.activate(featureContext);
      expect(feature.getParentEventTarget()).toBe(eventBus);
    });

    it('should dispatch an activated event', function() {
      var spy = jasmine.createSpy();
      feature.addEventListener(jssip.plugin.Feature.Event.ACTIVATED, spy);
      feature.activate(featureContext);
      expect(spy).toHaveBeenCalled();
    });

    it('should register for given feature types', function() {
      var spy = jasmine.createSpy();
      featureContext.registerFeatureForType = spy;
      feature.activate(featureContext);
      expect(spy).toHaveBeenCalledWith('amazing', feature);
      expect(spy).toHaveBeenCalledWith('spectacular', feature);
    });

    it('should register parser factories', function() {
      var hdrParser = {};
      var uriParser = {};

      feature.getHeaderParserFactory.andReturn(hdrParser);
      feature.getUriParserFactory.andReturn(uriParser);

      spyOn(parserRegistry, 'registerHeaderParserFactory').andReturn(true);
      spyOn(parserRegistry, 'registerUriParserFactory').andReturn(true);

      feature.activate(featureContext);

      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        expect(feature.getHeaderParserFactory).
            toHaveBeenCalledWith(header);
        expect(parserRegistry.registerHeaderParserFactory).
            toHaveBeenCalledWith(header, hdrParser);
      }

      for (i = 0; i < uriSchemes.length; i++) {
        var scheme = uriSchemes[i];
        expect(feature.getUriParserFactory).
            toHaveBeenCalledWith(scheme);
        expect(parserRegistry.registerUriParserFactory).
            toHaveBeenCalledWith(scheme, uriParser);
      }
    });
  });
});
