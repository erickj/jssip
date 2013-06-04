goog.provide('jssip.plugin.AbstractFeatureSpec');

goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.event.EventBus');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureContext');
goog.require('jssip.plugin.Feature.Event');

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
    var headerParserMap = { h: 'hdrparser' };
    var uriParserMap = { u: 'uriparser' }
    var parserRegistry;
    var featureContext;
    var eventBus;

    beforeEach(function() {
      eventHandlerMap['listen.test1'] = {};
      eventHandlerMap['listen.test2'] = {};

      feature = new jssip.plugin.AbstractFeature(name, undefined,
          eventHandlerMap, featureTypes, headerParserMap, uriParserMap);

      parserRegistry = new jssip.parser.ParserRegistry({} /* messageParserFactory */);

      featureContext = new jssip.plugin.FeatureContext();
      featureContext.getParserRegistry = function() { return parserRegistry; }

      eventBus = {
        addEventListener: jasmine.createSpy(),
        getParentEventTarget: function() {}
      }
      featureContext.getEventBus = function() { return eventBus; };
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
      spyOn(parserRegistry, 'registerHeaderParserFactory').andReturn(true);
      spyOn(parserRegistry, 'registerUriParserFactory').andReturn(true);

      feature.activate(featureContext);
      expect(parserRegistry.registerHeaderParserFactory).
          toHaveBeenCalledWith('h', 'hdrparser');
      expect(parserRegistry.registerUriParserFactory).
          toHaveBeenCalledWith('u', 'uriparser');
    });
  });
});
