goog.provide('jssip.testing.SharedMessageContextSpec');

goog.require('jssip.message.MessageContext');


var sharedMessageContextBehaviors = function(factoryFn) {
  describe('(shared)', function() {
    it('is a message context', function() {
      expect(factoryFn()).toEqual(jasmine.any(jssip.message.MessageContext));
    })
  });
};
