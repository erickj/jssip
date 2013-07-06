goog.provide('jssip.plugin.FeatureContextImplSpec');

goog.require('jssip.parser.ParserRegistry');
goog.require('jssip.event.EventBus');
goog.require('jssip.sip.UserAgent.Config');
goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureContextImpl');
goog.require('jssip.plugin.FeatureSet');


describe('jssip.plugin.FeatureContextImpl', function() {
  var context;
  var features;
  var featureSet;
  var eventBus;
  var parserRegistry;
  var requiredFeatureTypes;
  var userAgentConfig;
  var platformContext;
  var sipContext;

  beforeEach(function() {
    var f1 = new jssip.plugin.AbstractFeature(
        'feature1', {}, undefined, ['atype']);
    var f2 = new jssip.plugin.AbstractFeature(
        'feature2', {}, undefined, ['btype']);
    features = [f1, f2];
    featureSet = new jssip.plugin.FeatureSet(features);
    eventBus = new jssip.event.EventBus();
    parserRegistry = new jssip.parser.ParserRegistry();
    requiredFeatureTypes = ['atype'];
    var config = {};
    config[jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD] = 'aor';
    userAgentConfig = new jssip.sip.UserAgent.Config(
        [] /* featureNames */, config);
    platformContext = /** @type {!jssip.platform.PlatformContext} */ ({});
    sipContext = /** @type {!jssip.sip.SipContext} */ ({});

    context = new jssip.plugin.FeatureContextImpl(featureSet, eventBus,
        parserRegistry, requiredFeatureTypes, userAgentConfig, platformContext,
        sipContext);
  });

  describe('#isFeatureActive', function() {
    it('returns the activity state for the features', function() {
      expect(context.isFeatureActive('feature1')).toBe(false);
      features[0].activate(context);
      expect(context.isFeatureActive('feature1')).toBe(true);
    });
  });

  describe('#isFeatureTypeActive', function() {
    it('returns the activity state for a feature type', function() {
      expect(context.isFeatureTypeActive('atype')).toBe(false);
      features[0].activate(context);
      expect(context.isFeatureTypeActive('atype')).toBe(true);
    });
  });

  describe('facades', function() {
    beforeEach(function() {
      features[1].activate(context);
    });

    describe('#getFacadeByName', function() {
      it('throws an error if a feature does not exist', function() {
        expect(function() {
          context.getFacadeByName('adlfjaldj');
        }).toThrow()
      });

      it('throws an error if a feature is not active', function() {
        expect(function() {
          context.getFacadeByName('feature1');
        }).toThrow();
      });

      it('returns the facade for an active feature', function() {
        expect(context.getFacadeByName('feature2')).
          toBe(features[1].getFeatureFacade());
      });
    });

    describe('getFacadeByType', function() {
      it('throws an error if a feature does not exist', function() {
        expect(function() {
          context.getFacadeByType('adlfjaldj');
        }).toThrow()
      });

      it('throws an error if a feature is not active', function() {
        expect(function() {
          context.getFacadeByType('atype');
        }).toThrow();
      });

      it('returns the facade for an active feature', function() {
        expect(context.getFacadeByType('btype')).
          toBe(features[1].getFeatureFacade());
      });
    });
  });

  describe('#getEventBus', function() {
    it('gets the event bus', function() {
      expect(context.getEventBus()).toBe(eventBus);
    });
  });

  describe('#getParserRegistry', function() {
    it('gets the parser registry', function() {
      expect(context.getParserRegistry()).toBe(parserRegistry);
    });
  });

  describe('#getUserAgentConfigProperty', function() {
    it('gets a property value that is set', function() {
      var prop = jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD;
      var value = userAgentConfig.get(prop);
      expect(context.getUserAgentConfigProperty(prop)).toBe(value);
    });

    it('gets null for properties that are not set', function() {
      var prop = jssip.sip.UserAgent.ConfigProperty.OUTBOUND_PROXY;
      expect(context.getUserAgentConfigProperty(prop)).toBe(null);
    });
  });

  describe('#getPlatformContext', function() {
    it('gets the provided platform context', function() {
      expect(context.getPlatformContext()).toBe(platformContext);
    });
  });

  describe('#getSipContext', function() {
    it('gets the the provided SIP context', function() {
      expect(context.getSipContext()).toBe(sipContext);
    });
  });

  describe('#finalize', function() {
    var failureContext;
    beforeEach(function() {
      failureContext = new jssip.plugin.FeatureContextImpl(
        featureSet, eventBus, parserRegistry, ['notregistered']);

      for (var i = 0; i < features.length; i++) {
        features[i].activate(context);
      }
    });

    it('throws an error if finalized twice', function() {
      context.finalize();
      expect(function() {
        context.finalize();
      }).toThrow();
    })

    it('throws an error if not all required types were registered', function() {
      expect(function() {
        failureContext.finalize();
      }).toThrow();
    });

    it('succeeds otherwise', function() {
      context.finalize();
    });
  });
});
