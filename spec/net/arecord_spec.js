goog.provide('jssip.net.ARecordSpec');

goog.require('jssip.net.ARecord');
goog.require('jssip.testing.shared.ResourceRecordSpec');

describe('jssip.net.ARecord', function() {
  var aRecord;
  var domainName = 'domain.net';
  var ttl = 100;
  var ip4Address = '123.231.312.123';

  var factoryFn = function() {
    aRecord = new jssip.net.ARecord(domainName, ttl, ip4Address);
    return aRecord;
  };
  beforeEach(factoryFn);

  describe('getters', function() {
    it('should return A record valeus', function() {
      expect(aRecord.getIpAddress()).toBe(ip4Address);
    });
  });

  jssip.testing.shared.ResourceRecordSpec.runSpecs(
      factoryFn, domainName, ttl, jssip.net.ResourceRecord.RecordType.A);
});
