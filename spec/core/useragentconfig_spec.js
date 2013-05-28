goog.provide('jssip.core.UserAgent.ConfigSpec');

goog.require('jssip.core.PropertyHolder');
goog.require('jssip.core.UserAgent');
goog.require('jssip.core.UserAgent.Config');

describe('jssip.core.UserAgent.Config', function() {
  var configProperties;
  var featureNames;
  var config;

  beforeEach(function() {
    featureNames = ['abc', 'def'];

    configProperties = {};
    configProperties[
        jssip.core.UserAgent.ConfigProperty.ADDRESS_OF_RECORD] =
            'sip:foo@bar.com';
    configProperties[
        jssip.core.UserAgent.ConfigProperty.OUTBOUND_PROXY] =
            'sip:outbound.proxy.com';

    config = new jssip.core.UserAgent.Config(featureNames, configProperties);
  });

  describe('#getFeatureNames', function() {
    it('should provide access to feature names', function() {
      expect(config.getFeatureNames()).toEqual(['abc', 'def']);
    });
  });

  describe('as property holder', function() {
    describe('new', function() {
      it('should be a property holder', function() {
        expect(config).toEqual(jasmine.any(jssip.core.PropertyHolder));
      });
    });

    it('should #get properties', function() {
      for (var key in configProperties) {
        expect(config.get(key)).toBe(configProperties[key]);
      }
    });
  });
});
