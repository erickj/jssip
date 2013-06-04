goog.provide('jssip.sip.UserAgent.ConfigSpec');

goog.require('jssip.util.PropertyHolder');
goog.require('jssip.sip.UserAgent');
goog.require('jssip.sip.UserAgent.Config');

describe('jssip.sip.UserAgent.Config', function() {
  var configProperties;
  var featureNames;
  var config;

  beforeEach(function() {
    featureNames = ['abc', 'def'];

    configProperties = {};
    configProperties[
        jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD] =
            'sip:foo@bar.com';
    configProperties[
        jssip.sip.UserAgent.ConfigProperty.OUTBOUND_PROXY] =
            'sip:outbound.proxy.com';

    config = new jssip.sip.UserAgent.Config(featureNames, configProperties);
  });

  describe('#getFeatureNames', function() {
    it('should provide access to feature names', function() {
      expect(config.getFeatureNames()).toEqual(['abc', 'def']);
    });
  });

  describe('as property holder', function() {
    describe('new', function() {
      it('should be a property holder', function() {
        expect(config).toEqual(jasmine.any(jssip.util.PropertyHolder));
      });
    });

    it('should #get properties', function() {
      for (var key in configProperties) {
        expect(config.get(key)).toBe(configProperties[key]);
      }
    });
  });
});
