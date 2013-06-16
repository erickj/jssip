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
        '"Erick" <sip:erick@10.0.1.12:5060;transport=udp>;expires=600';
    var addrSpecContactValue = 'sip:erick@10.0.1.12:5060;expires=600';

    it('should parse a header matching a name-addr and parameters',
       function() {
         var rawSipUri = 'sip:erick@10.0.1.12:5060;transport=udp';
         var displayName = '"Erick"';
         var nameAddrPair = [displayName, rawSipUri];
         var contactParams = [['expires', '600']];

         expect(parser.parse(nameAddrContactValue, 'Contact')).
             toBeContactArray([[nameAddrPair, contactParams]]);
       });

    it('should parse a header matching an addr-spec and parameters',
       function() {
         var rawSipUri = 'sip:erick@10.0.1.12:5060';
         var contactParams = [['expires', '600']];

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
