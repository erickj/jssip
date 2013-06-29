// Need to capitalize "Rfc" to placate bad build target rule assumption, might
// consider fixing this in the Rakefile
goog.provide('jssip.sip.grammar.Rfc3261Spec');

goog.require('goog.array');
goog.require('goog.object');
goog.require('jssip.sip.grammar.rfc3261');
goog.require('jssip.sip.protocol.rfc3261');
goog.require('jssip.testing.util.messageutil');

describe('jssip.sip.grammar.rfc3261', function() {
  var rawExampleMessageMap = jssip.testing.util.messageutil.ExampleMessage;
  var exampleMessages;
  var aAddrSpec = 'sip:erick@foo.com';
  var aNameAddr = '"Erick" <sip:erick@foo.com>';
  var parser = jssip.sip.grammar.rfc3261;
  var startRule;

  var allTestedHeaders =
      goog.object.getValues(jssip.sip.protocol.rfc3261.HeaderType);

  beforeEach(function() {
    exampleMessages = [];
    for (var messageType in rawExampleMessageMap) {
      exampleMessages.push(jssip.testing.util.messageutil.parseMessage(
          rawExampleMessageMap[messageType]));
    };

    this.addMatchers(/** @lends {jasmine.Matcher.prototype } */ ({
      /**
       * @param {string} name
       * @param {string=} opt_value
       */
      toBeParam: function(name, opt_value) {
        var expectedValue = goog.isDef(opt_value) ?
            [name, '=', opt_value] : [name];

        expect(this.actual).toEqual(jasmine.any(Array));
        expect(this.actual[0]).toBe(';');
        expect(this.actual[1]).toEqual(expectedValue);
        return true;
      },

      /**
       * @param {string} sipUri
       */
      toBeSipUri: function(sipUri) {
        expect(this.actual).toEqual(jasmine.any(String));
        expect(this.actual).toBe(sipUri);
        return true;
      },

      /**
       * @param {string} sipUri
       */
      toBeAddrSpec: function(sipUri) {
        expect(this.actual).toBeSipUri(sipUri);
        return true;
      },

      /**
       * @param {string=} displayName
       * @param {string=} sipUri
       */
      toBeNameAddr: function(displayName, sipUri) {
        expect(this.actual).toEqual(jasmine.any(Array));
        expect(this.actual.length).toBe(4);
        expect(this.actual[0]).toEqual(jasmine.any(String));
        expect(this.actual[1]).toBe('<');
        expect(this.actual[2]).toBeSipUri(sipUri);
        expect(this.actual[3]).toBe('>');
        return true;
      },

      /**
       * @param {!Array} sipUriContactParamsPair
       */
      toBeContactArray: function(sipUriContactParamsPair) {
        expect(this.actual).toEqual(jasmine.any(Array));
        expect(this.actual.length).toBe(2);
        expect(this.actual[0]).toBeContact(sipUriContactParamsPair[0]);
        return true;
      },

      /**
       * @param {!Array} sipUriContactParamsPair
       */
      toBeContact: function(sipUriContactParamsPair) {
        var expectedDisplaySipUri = sipUriContactParamsPair[0];
        var expectedContactParams = sipUriContactParamsPair[1];

        expect(this.actual).toEqual(jasmine.any(Array));
        expect(this.actual.length).toBe(2);

        // AddrSpec or NameAddr
        var nameAddrOrAddrSpec = this.actual[0];
        if (goog.isArray(expectedDisplaySipUri)) {
          expect(nameAddrOrAddrSpec).
              toBeNameAddr(expectedDisplaySipUri[0], expectedDisplaySipUri[1]);
        } else {
          expect(nameAddrOrAddrSpec).toBeAddrSpec(expectedDisplaySipUri);
        }

        // Contact Params
        var params = this.actual[1];
        expect(params.length).toBe(expectedContactParams.length);
        for (var i = 0; i < params.length; i++) {
          var expectedParamName = expectedContactParams[i][0];
          var expectedParamValue = expectedContactParams[i][1];
          expect(params[i]).toBeParam(expectedParamName, expectedParamValue);
        }
        return true;
      },

      /**
       * @param {!Array} expectedFirstViaParm toBeViaParm argument list
       * @param {!Array=} opt_expectedAddlViaParms Array of toBeViaParam
       *     argument list
       */
      toBeVia: function(expectedFirstViaParm, opt_expectedAddlViaParms) {
        var via = this.actual;
        expect(via).toEqual(jasmine.any(Array));
        expect(via.length).toBe(2)

        var viaParm = via[0];
        expect(viaParm).toBeViaParm.apply(
            expect(viaParm), expectedFirstViaParm);

        var addlViaParms = via[1];
        var expectedAddlViaParms = opt_expectedAddlViaParms || [];
        expect(addlViaParms.length).toBe(expectedAddlViaParms.length);
        for (var i = 0; i < addlViaParms.length; i++) {
          expect(addlViaParms[i]).toBeViaParm.apply(
              expect(addlViaParms[i]), expectedAddlViaParms[i]);
        }
        return true;
      },

      /**
       * @param {string} protocol Probably just 'SIP'
       * @param {string} version Probably just '2.0'
       * @param {string} transport UDP/TCP/TLS etc..
       * @param {string} host Hostname or IP address
       * @param {string=} opt_port An optional port
       * @param {!Array.<!Array.<string>>} opt_params
       */
      toBeViaParm: function(
          protocol, version, transport, host, opt_port, opt_params) {
        var viaParm = this.actual;
        expect(viaParm).toEqual(jasmine.any(Array));

        var sentProtocol = viaParm[0];
        expect(sentProtocol).toEqual(
          [protocol, '/', version, '/', transport]);

        var lws = viaParm[1];
        expect(lws).toMatch(/\s*/);

        var sentBy = viaParm[2];
        var expectedPort = opt_port ? [':', opt_port] : [];
        expect(sentBy).toEqual([host, expectedPort]);

        var viaParams = viaParm[3];
        expect(viaParams).toEqual(jasmine.any(Array));
        opt_params = opt_params || [];

        expect(viaParams.length).toBe(opt_params.length);
        for (var i = 0; i < viaParams.length; i++) {
          var key = opt_params[i][0];
          var opt_value = opt_params[i][1];
          expect(viaParams[i]).toBeParam(key, opt_value);
        }
        return true;
      }
    }))
  });

  describe('Grammar Primitives', function() {
    var startRuleToValueMap = {
      'SIP_URI': [
        'sip:alice@atlanta.com',
        'sip:alice:secretword@atlanta.com;transport=tcp',
        'sips:alice@atlanta.com?subject=project%20x&priority=urgent',
        'sip:+1-212-555-1212:1234@gateway.com;user=phone',
        'sips:1212@gateway.com',
        'sip:alice@192.0.2.4',
        'sip:atlanta.com;method=REGISTER?to=alice%40atlanta.com',
        'sip:alice;day=tuesday@atlanta.com'
      ],
      'name_addr': [
        '"Erick" <sip:erick@foo.com>',
        '"Erick" <sip:erick@foo.com;x=y>',
        '<sip:erick@foo.com>',
        '"Erick" <sip:erick@foo.com;x=y?h1=v1>',
        'Erick <sip:erick@foo.com>'
      ],
      'addr_spec': [
        'sip:erick@foo.com'
      ],
      'IPv4address': [
        '1.2.3.4',
        '255.255.255.255',
        '0.0.0.0'
      ]
    };

    for (var startRule in startRuleToValueMap) {
      var suiteName = "%s specs".replace('%s', startRule);
      describe(suiteName, function(startRule) {
        return function() {
          it('should parse valid values', function() {
            var values = startRuleToValueMap[startRule];
            for (var i = 0; i < values.length; i++) {
              var value = values[i];
              var parsedValue;
              expect(function() {
                parsedValue = parser.parse(value, startRule);
              }).not.toThrow();
            };
          });
        };
      }(startRule));
    };
  });

  describe('Contact header', function() {
    var nameAddrContactValue =
        '"Erick" <sip:erick@10.0.1.12:5060;transport=udp>;expires=600;foo';
    var addrSpecContactValue = 'sip:erick@10.0.1.12:5060;expires=600;foo';

    it('should parse a header matching a name-addr and parameters',
       function() {
         var rawSipUri = 'sip:erick@10.0.1.12:5060;transport=udp';
         var displayName = '"Erick"';
         var nameAddrPair = [displayName, rawSipUri];
         var contactParams = [['expires', '600'], ['foo']];

         expect(parser.parse(nameAddrContactValue, 'Contact')).
             toBeContactArray([[nameAddrPair, contactParams]]);
       });

    it('should parse a header matching an addr-spec and parameters',
       function() {
         var rawSipUri = 'sip:erick@10.0.1.12:5060';
         var contactParams = [['expires', '600'], ['foo']];

         expect(parser.parse(addrSpecContactValue, 'Contact')).
             toBeContactArray([[rawSipUri, contactParams]]);
       });
  });

  // Apply all of the following specs to both To and From headers
  describe('From and To headers', function() {
    var headers = ['To', 'From'];
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      var msg = '%s header'.replace('%s', header);
      var msgShouldParseA = 'should parse a ' + header + ' header';

      describe(msg, function() {
        beforeEach(function() {
          startRule = header;
        });

        it(msgShouldParseA + ' with an addr-spec', function() {
          var result = parser.parse(aAddrSpec, startRule);
          expect(result.length).toBe(2);
          expect(result[0]).toBeAddrSpec('sip:erick@foo.com');
        });

        it(msgShouldParseA + ' with a name-addr', function() {
          var result = parser.parse(aNameAddr, startRule);
          expect(result.length).toBe(2);
          expect(result[0]).toBeNameAddr('"Erick"', 'sip:erick@foo.com');
        });

        // For each header type, also test parameter parsing with both
        // addr-spec and name-addr forms.
        var formats = { 'addr-spec': aAddrSpec, 'name-addr': aNameAddr };
        for (var f in formats) {
          var msgShouldParseTagParam = msgShouldParseA +
              ' with format %s with a tag_param'.replace('%s', f);
          it(msgShouldParseTagParam, function() {
            var headerValue = formats[f] + ';tag=yoohoo';
            var result = parser.parse(headerValue, startRule);
            expect(result[1]).toEqual(jasmine.any(Array));
            expect(result[1].length).toBe(1);
            expect(result[1][0]).toBeParam('tag', 'yoohoo');
          });

          var msgShouldParseGenericParams = msgShouldParseA +
              ' with format %s with generic params'.replace('%s', f);
          it(msgShouldParseGenericParams, function() {
            var headerValue = formats[f] + ';avar=xyz;bvar';
            var result = parser.parse(headerValue, startRule);
            expect(result[1]).toEqual(jasmine.any(Array));
            expect(result[1].length).toBe(2);

            // avar=xyz
            expect(result[1][0]).toBeParam('avar', 'xyz');

            // bvar
            expect(result[1][1]).toBeParam('bvar');
          });
        };
      });
    };
  }); // end To/From shared specs

  // @see RFC 3261 Section 20.42
  describe('Via header', function() {
    it('should parse a Via header value', function() {
      var viaHeaderValue =
          "SIP/2.0/UDP erlang.bell-telephone.com:5060;branch=z9hG4bK87asdks7";
      var parsedVia = parser.parse(viaHeaderValue, 'Via');
      expect(parsedVia).toBeVia(
          ['SIP', '2.0', 'UDP', 'erlang.bell-telephone.com', '5060',
              [['branch', 'z9hG4bK87asdks7']]]);
    });

    it('should parse a Via header value with multiple params', function() {
      var viaHeaderValue =
          "SIP/2.0/UDP 192.0.2.1:5060 ;received=192.0.2.207;branch=z9hG4bK77asjd";
      var parsedVia = parser.parse(viaHeaderValue, 'Via');
      expect(parsedVia).toBeVia(['SIP', '2.0', 'UDP', '192.0.2.1', '5060',
          [['received', '192.0.2.207'], ['branch', 'z9hG4bK77asjd']]]);
    });

    it('should parse a Via header value with extra whitespace', function() {
      var viaHeaderValue = "SIP / 2.0 / UDP first.example.com: 4000;ttl=16" +
          ";maddr=224.2.0.1 ;branch=z9hG4bKa7c6a8dlze.1"
      var parsedVia = parser.parse(viaHeaderValue, 'Via');
      expect(parsedVia).toBeVia(['SIP', '2.0', 'UDP', 'first.example.com', '4000',
          [['ttl', '16'],
           ['maddr', '224.2.0.1'],
           ['branch', 'z9hG4bKa7c6a8dlze.1']]]);
    });
  });

  describe('All header specs', function() {
    for (var i = 0; i < allTestedHeaders.length; i++) {
      var header = allTestedHeaders[i];
      var suiteName = '%s header'.replace('%s', header);
      describe(suiteName, function() {
        it('should be parseable from example messages', function(header) {
          return function() {
            for (var j = 0; j < exampleMessages.length; j++) {
              var values = exampleMessages[j].getHeaderValue(header);
              if (goog.isNull(values)) {
                continue;
              }
              for (var k = 0; k < values.length; k++) {
                expect(function() {
                  parser.parse(values[k], header.replace('-', '_'));
                }).not.toThrow();
              }
            }
          };
        }(header));
      });
    }
  });
});
