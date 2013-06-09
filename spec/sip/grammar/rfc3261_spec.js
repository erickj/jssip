// Need to capitalize "Rfc" to placate bad build target rule assumption, might
// consider fixing this in the Rakefile
goog.provide('jssip.sip.grammar.Rfc3261Spec');

goog.require('goog.array');
goog.require('jssip.sip.grammar.rfc3261');

describe('jssip.sip.grammar.rfc3261', function() {
  var aAddrSpec = 'sip:erick@foo.com';
  var aNameAddr = '"Erick" <sip:erick@foo.com>';
  var parser = jssip.sip.grammar.rfc3261;
  var startRule;

  beforeEach(function() {
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
       * @param {boolean} noParams
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
      }
    }))
  });

  // Apply all of the following specs to both To and From headers
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
  }; // end To/From shared specs
});
