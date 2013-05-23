goog.provide('jssip.plugin.FeatureSetSpec');

goog.require('jssip.plugin.Feature');
goog.require('jssip.plugin.FeatureSet');

describe('jssip.plugin.FeatureSet', function() {
  var featureSet;
  var features;
  var makeFeature = function(name) {
    var feature = new jssip.plugin.Feature();
    feature.getName = function() { return name; }
    return feature;
  };

  beforeEach(function() {
    features = [makeFeature('a'), makeFeature('b')];
    featureSet = new jssip.plugin.FeatureSet(features);
  });

  describe('new', function() {
    it('should throw an error if two features have the same name', function() {
      features = [makeFeature('a'), makeFeature('a')];
      expect(function() {
        new jssip.plugin.FeatureSet(features);
      }).toThrow();
    });
  });

  describe('#getFeatureByName', function() {
    it('should return the feature by name', function() {
      expect(featureSet.getFeatureByName('a')).toBe(features[0]);
      expect(featureSet.getFeatureByName('b')).toBe(features[1]);
    });

    it('should return null for unknown features', function() {
      expect(featureSet.getFeatureByName('foo')).toBe(null);
    });
  });

  describe('#getSet', function() {
    it('should return a set with containing all features', function() {
      var set = featureSet.getSet();
      expect(set.containsAll(features)).toBe(true);
    });

    it('should return unique set instances on each call', function() {
      expect(featureSet.getSet()).not.toBe(featureSet.getSet());
    });
  });
});
