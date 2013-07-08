goog.provide('jssip.sip.plugin.core.UserAgentFeatureSpec');

goog.require('goog.object');
goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageContext');
goog.require('jssip.sip.UserAgent.Config');
goog.require('jssip.sip.plugin.core.UserAgentFeature');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.Route');
goog.require('jssip.sip.protocol.feature.UserAgentClient');
goog.require('jssip.sip.protocol.header.NameAddrListHeaderParserFactory');
goog.require('jssip.sip.protocol.header.ViaHeaderParserFactory');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.testing.util.featureutil');
goog.require('jssip.testing.util.messageutil');
goog.require('jssip.testing.util.protocolutil');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');


describe('jssip.sip.plugin.core.UserAgentFeature', function() {
  var rfc3261 = jssip.sip.protocol.rfc3261;
  var exampleMessage = jssip.testing.util.messageutil.ExampleMessage;

  var userAgentFeature;
  var userAgentConfig;
  var eventBus;
  var featureName = 'useragentfeature';
  var featureContext;
  var eventListener;

  beforeEach(function() {
    var propertyMap = {};
    propertyMap[jssip.sip.UserAgent.ConfigProperty.ADDRESS_OF_RECORD] =
        'erick@bar.com';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.DISPLAY_NAME] =
        'EJ';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.OUTBOUND_PROXY] =
        'sip.ejjohnson.org:5060';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.VIA_SENT_BY] =
        '10.1.1.1:5061';
    propertyMap[jssip.sip.UserAgent.ConfigProperty.CONTACT] =
        '20.2.2.2:5062';

    eventBus = new jssip.event.EventBus();
    featureContext = jssip.testing.util.featureutil.createFeatureContext(
        eventBus, propertyMap);

    userAgentConfig = new jssip.sip.UserAgent.Config([featureName])
    userAgentFeature = new jssip.sip.plugin.core.UserAgentFeature(
        featureName);
    userAgentFeature.activate(featureContext);
  });

  describe('#getHeaderParserFactory', function() {
    it('throws if the feature is not yet activated', function() {
      userAgentFeature = new jssip.sip.plugin.core.UserAgentFeature(
          'unactivated-feature');
      expect(function() {
        userAgentFeature.getHeaderParserFactory('From');
      }).toThrow();
    });

    it('throws if the header type is not one declared in 3261',
       function() {
         expect(function() {
           userAgentFeature.getHeaderParserFactory('Foobars');
         }).toThrow();
       });

    describe('3261 headers', function() {
      var customHeaderParserFactories = {
        Contact: jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        Route: jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        'Record-Route':
            jssip.sip.protocol.header.NameAddrListHeaderParserFactory,
        To: jssip.sip.protocol.header.NameAddrHeaderParserFactory,
        From:jssip.sip.protocol.header.NameAddrHeaderParserFactory,
        Via: jssip.sip.protocol.header.ViaHeaderParserFactory
      };

      for (var headerKey in jssip.sip.protocol.rfc3261.HeaderType) {
        var hdr = jssip.sip.protocol.rfc3261.HeaderType[headerKey];
        var msg = 'returns a header parser for header ' + hdr;
        it(msg, function(hdr) {
          return function() {
            var parser = userAgentFeature.getHeaderParserFactory(hdr);
            expect(parser).toEqual(jasmine.any(
                customHeaderParserFactories[hdr] ||
                    jssip.sip.plugin.core.HeaderParserFactoryImpl));
          };
        }(hdr));
      };
    });

    describe('custom header parser factory', function() {
      describe('To and From headers', function() {
        var nameAddrHeaderParsers = ['To', 'From'];
        var nameAddr = 'sip:erick@bar.com;tag=1234';
        for (var i = 0; i < nameAddrHeaderParsers.length; i++) {
          var hdr = nameAddrHeaderParsers[i];

          it('parses NameAddr objects for header ' + hdr, function(hdr) {
            return function() {
              var parserFactory = userAgentFeature.getHeaderParserFactory(hdr);
              var parser = parserFactory.createParser(nameAddr);
              var header = parser.parse();
              expect(header.getHeaderName()).toBe(hdr);
              expect(header.getNameAddr()).toEqual(jasmine.any(
                jssip.sip.protocol.NameAddr))
              expect(header.getNameAddr().getContextParams().getParameter('tag')).
                toBe('1234');
            };
          }(hdr));
        };
      });
    });
  });

  describe('#getUriParserFactory', function() {
    it('throws if the scheme is not SIP or SIPS', function() {
      expect(function() {
        userAgentFeature.getUriParserFactory('foo');
      }).toThrow();
    });

    it('returns a SipUriParserFactory for SIP and SIPS schemes', function() {
      expect(userAgentFeature.getUriParserFactory(jssip.uri.Uri.Scheme.SIP)).
          toEqual(jasmine.any(jssip.sip.plugin.core.SipUriParserFactory));
      expect(userAgentFeature.getUriParserFactory(jssip.uri.Uri.Scheme.SIPS)).
          toEqual(jasmine.any(jssip.sip.plugin.core.SipUriParserFactory));
    });
  });

  describe('#handleRespose', function() {
    beforeEach(function() {
      eventListener = jasmine.createSpy();
      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.RECEIVE_RESPONSE,
          eventListener);
    });

    it('emits RECEIVE_RESPONSE events', function() {
      var rawMessageContext = jssip.testing.util.messageutil.createRawMessageContext(
          exampleMessage.INVITE_200_OK);

      userAgentFeature.handleResponse(rawMessageContext);
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toBe(rawMessageContext);
    });

    it('throws an error if it receives a request', function() {
      var exampleMessage = jssip.testing.util.messageutil.ExampleMessage;

      expect(function() {
        userAgentFeature.handleResponse(
            jssip.testing.util.messageutil.createRawMessageContext(
                exampleMessage.INVITE));
      }).toThrow();
    });
  });

  describe('#createRequest', function() {
    var toUri;
    var toNameAddr;
    var fromUri;
    var fromNameAddr;

    var expectedContact;
    var expectedContactUri;

    beforeEach(function() {
      expectedContactUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.PORT, '5060').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, '1.2.3.4').build();
      expectedContact = new jssip.sip.protocol.NameAddr(expectedContactUri);

      // Monkey patch
      featureContext.getSipContext().getContact = function() {
        return expectedContact;
      }

      eventListener = jasmine.createSpy();
      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST,
          eventListener);

      toUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'to.host').build();
      toNameAddr = new jssip.sip.protocol.NameAddr(toUri);

      fromUri = (new jssip.uri.Uri.Builder()).
          addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
          addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'from.host').build();
      fromNameAddr = new jssip.sip.protocol.NameAddr(fromUri);
    });

    describe('message format', function() {
      var headerType = rfc3261.HeaderType;
      var messageContext;
      var message;

      describe('out of dialog', function() {
        beforeEach(function() {
          messageContext = userAgentFeature.
              createRequest('FOOSBAR', toNameAddr, fromNameAddr);
          message = messageContext.getMessage();
        });

        it('adds a request URI from the To header', function() {
          expect(message.getRequestUri()).toBe(toNameAddr.getUri().stringify());
        });

        it('has no Route header by default', function() {
          expect(message.getHeaderValue(headerType.ROUTE)).toBe(null);
        });

        it('adds a Contact header', function() {
          expect(message.getHeaderValue(headerType.CONTACT)).
              toEqual([expectedContact.stringify()]);
        });

        it('adds a To header', function() {
          expect(message.getHeaderValue(headerType.TO)).
              toEqual([toNameAddr.stringify()]);
        });

        it('adds a From header', function() {
          var regex =
              new RegExp('^' + fromNameAddr.stringify() + ';tag=[a-f0-9]{7}$');
          expect(message.getHeaderValue(headerType.FROM).length).toBe(1);
          expect(message.getHeaderValue(headerType.FROM)[0]).toMatch(regex);
        });

        it('adds a Call-ID header', function() {
          var regex = /[a-f0-9]{32}/;
          expect(message.getHeaderValue(headerType.CALL_ID).length).toBe(1);
          expect(message.getHeaderValue(headerType.CALL_ID)).toMatch(regex);
        });

        it('adds a CSeq header', function() {
          expect(message.getHeaderValue(headerType.CSEQ)).
              toEqual(['1 FOOSBAR']);
        });

        it('adds a Max-Forwards header', function() {
          expect(message.getHeaderValue(headerType.MAX_FORWARDS)).
              toEqual(['70']);
        });

        describe('with preloaded route', function() {
          var route1;
          var route2;

          beforeEach(function() {
            var routeUri1 = (new jssip.uri.Uri.Builder()).
                addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
                addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'route1').
                build();
            var routeUri2 = (new jssip.uri.Uri.Builder()).
                addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
                addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'route2').
                build();

            route1 = new jssip.sip.protocol.Route(
                new jssip.sip.protocol.NameAddr(routeUri1));
            route2 = new jssip.sip.protocol.Route(
                new jssip.sip.protocol.NameAddr(routeUri2));

            // Monkey patch
            featureContext.getSipContext().getPreloadedRoutes = function() {
              return [route1, route2];
            }

            messageContext = userAgentFeature.
              createRequest('FOOSBAR', toNameAddr, fromNameAddr);
            message = messageContext.getMessage();
          });

          it('has a preloaded route', function() {
            expect(message.getHeaderValue(headerType.ROUTE)).toEqual(
                [route1.stringify(), route2.stringify()]);
          });
        });
      });

      describe('in dialog', function() {
        var dialog;

        describe('with loose route', function() {
          beforeEach(function() {
            var uriParamterParserFactory =
                userAgentFeature.getUriParserFactory('sip');
            var uriParamterParser =
                uriParamterParserFactory.createParser('sip:foo@bar.com');
            dialog = jssip.testing.util.protocolutil.createDummyDialog(
              false /* hasStrictRoutes */, uriParamterParser);
            messageContext = userAgentFeature.
              createRequest('FOOSBAR', toNameAddr, fromNameAddr, dialog);
            message = messageContext.getMessage();
          });

          it('uses the remote target for request URI',
             function() {
               expect(message.getRequestUri()).toBe(
                 dialog.getRemoteTarget().stringify());
             });

          it('uses the dialog route set in the Route header', function() {
            var routes = dialog.getRouteSet().getRoutes();
            expect(message.getHeaderValue(headerType.ROUTE)).toEqual(
                [routes[0].stringify(), routes[1].stringify()]);
          });

          it('uses the dialog remote uri and tag for To header', function() {
            expect(message.getHeaderValue(headerType.TO)).toEqual(
                [dialog.getToNameAddr(true /* isRequest */).stringify()]);
          });

          it('uses the dialog local uri and tag for From header', function() {
            expect(message.getHeaderValue(headerType.FROM)).toEqual(
                [dialog.getFromNameAddr(true /* isRequest */).stringify()]);
          });

          it('uses the dialog Call-ID', function() {
            expect(message.getHeaderValue(headerType.CALL_ID)).
                toEqual([dialog.getCallId()]);
          });

          it('uses the next local sequence number in the CSeq header',
             function() {
               expect(message.getHeaderValue(headerType.CSEQ)).
                   toEqual(['43 FOOSBAR']);
             });
        });

        describe('with strict route', function() {
          beforeEach(function() {
            var uriParamterParserFactory =
                userAgentFeature.getUriParserFactory('sip');
            var uriParamterParser =
                uriParamterParserFactory.createParser('sip:foo@bar.com');
            dialog = jssip.testing.util.protocolutil.createDummyDialog(
                true /* hasStrictRoutes */, uriParamterParser);
            messageContext = userAgentFeature.
                createRequest('FOOSBAR', toNameAddr, fromNameAddr, dialog);
            message = messageContext.getMessage();
          });

          it('uses the first strict route as the request URI',
             function() {
               var routes = dialog.getRouteSet().getRoutes();
               expect(message.getRequestUri()).toBe('sip:dialog.route1');
             });

          it('shuffles the routeset around with the remote target', function() {
            var routes = dialog.getRouteSet().getRoutes();
            expect(message.getHeaderValue(headerType.ROUTE)).toEqual(
                ['<sip:dialog.route2>', '<sip:remotetarget@dialog.target>']);
          });
        });
      });
    });

    it('returns a message context', function() {
      var messageContext = userAgentFeature.
          createRequest('FOOSBAR', toNameAddr, fromNameAddr);
      expect(messageContext).toEqual(jasmine.any(jssip.message.MessageContext));
      expect(messageContext.getMessage().getMethod()).toBe('FOOSBAR');
    });

    it('dispatches a CREATE_RESPONSE event', function() {
      var resultMessageContext =
          userAgentFeature.createRequest('INVITE', toNameAddr, fromNameAddr);
      expect(eventListener).toHaveBeenCalledWith(
          jasmine.any(jssip.sip.event.MessageEvent));

      var event = eventListener.calls[0].args[0];
      expect(event.messageContext).toBe(resultMessageContext);
    });

    it('is possible to add and override message headers', function() {
      eventListener = function(evt) {
        var builderContext = evt.messageContext;
        builderContext.setHeader('X-Foobar', 'xfoo');
        builderContext.setHeader('From', 'yomama', true /* opt_overwrite */);
      };

      eventBus.addEventListener(
          jssip.sip.protocol.feature.UserAgentClient.EventType.CREATE_REQUEST,
          eventListener);
      var messageContext =
          userAgentFeature.createRequest('INVITE', toNameAddr, fromNameAddr)
      var message = messageContext.getMessage();
      var headerType = rfc3261.HeaderType;
      jssip.testing.util.messageutil.checkMessageHeaders(goog.object.create(
        'X-Foobar', 'xfoo',
        'From', 'yomama'
      ), message);
    });
  });
});
