goog.provide('jssip.plugin.AbstractFeatureSpec');

goog.require('jssip.core.EventBus');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureContext');

describe('jssip.plugin.AbstractFeature', function() {
  var feature;
  var eventTypes = ['event.foo', 'event.bar'];
  var name = 'test.abstractfeature';

  beforeEach(function() {
    feature = new jssip.plugin.AbstractFeature(eventTypes, name);
  });

  it('should be an event bus', function() {
    expect(feature instanceof jssip.core.EventBus).toBe(true);
  });

  describe('getters', function() {
    it('should get the name', function() {
      expect(feature.getName()).toBe(name);
    });

    it('should get the event types', function() {
      expect(feature.getEventTypes()).toBe(eventTypes);
    });

    describe('feature delegate', function() {
      it('should throw on #getFeatureDelegate if not set', function() {
        expect(function() { feature.getFeatureDelegate(); }).toThrow();
      });

      it('should return the feature delegate when set', function() {
        var featureDelegate = {};
        feature =
            new jssip.plugin.AbstractFeature(eventTypes, name, featureDelegate);
        expect(feature.getFeatureDelegate()).toBe(featureDelegate);
      });
    });
  });

  describe('on activation', function() {
    var eventHandlerMap = {};
    var featureContext;
    var eventBus;

    beforeEach(function() {
      eventHandlerMap['listen.test1'] = {};
      eventHandlerMap['listen.test2'] = {};

      feature = new jssip.plugin.AbstractFeature(
          eventTypes, name, undefined, eventHandlerMap);

      featureContext = new jssip.plugin.FeatureContext();
      eventBus = {
        addEventListener: jasmine.createSpy()
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
  });
});
