goog.provide('jssip.testing.shared.SharedHeaderDecoratorSpec');

goog.require('jssip.message.HeaderDecorator');


/**
 * @param {function(): !jssip.message.HeaderDecorator} factoryFn
 * @param {string} headerName
 * @param {string} rawHeaderValue
 * @param {*} parsedHeaderValue
 */
jssip.testing.shared.SharedHeaderDecoratorSpec.sharedBehaviors =
    function(factoryFn, headerName, rawHeaderValue, parsedHeaderValue) {
  describe('(shared)', function() {
    var headerDecorator;
    beforeEach(function() {
      headerDecorator = factoryFn();
    });

    it('is a header decorator', function() {
      expect(headerDecorator).toEqual(
          jasmine.any(jssip.message.HeaderDecorator));
    })

    describe('getters', function() {
      describe('#getHeaderName', function() {
        it('should be the header name', function() {
          expect(headerDecorator.getHeaderName()).toBe(headerName);
        });
      });

      describe('#getRawValue', function() {
        it('should be the raw value', function() {
          expect(headerDecorator.getRawValue()).toBe(rawHeaderValue);
        });
      });

      describe('#getParsedValue', function() {
        it('should be the parsed value', function() {
          expect(headerDecorator.getParsedValue()).toEqual(parsedHeaderValue);
        });
      });
    });
  });
};
