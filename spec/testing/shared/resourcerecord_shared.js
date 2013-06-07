goog.provide('jssip.testing.shared.ResourceRecordSpec');

goog.require('jssip.net.ResourceRecord');


/**
 * @param {function():!jssip.net.ResourceRecord} factoryFn
 * @param {string} name
 * @param {number} ttl
 * @param {string} type
 */
jssip.testing.shared.ResourceRecordSpec.runSpecs =
    function(factoryFn, name, ttl, type) {
  describe('shared resource record', function() {
    var resourceRecord;
    beforeEach(function() {
      resourceRecord = factoryFn();
    });

    it('is a resource record of with the expected name, ttl, and type',
       function() {
         expect(resourceRecord).toEqual(jasmine.any(jssip.net.ResourceRecord));
         expect(resourceRecord.getDomainName()).toBe(name);
         expect(resourceRecord.getTtl()).toBe(ttl);
         expect(resourceRecord.getType()).toBe(type)
       });

    it('should be an immutable property holder', function() {
      expect(function() {
        resourceRecord.set('foo', 'bar');
      }).toThrow();
    })
  });
};
