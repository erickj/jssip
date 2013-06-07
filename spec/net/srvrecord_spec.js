goog.provide('jssip.net.SrvRecordSpec');

goog.require('jssip.net.SrvRecord');
goog.require('jssip.testing.shared.ResourceRecordSpec');

describe('jssip.net.SrvRecord', function() {
  var srvRecord;
  var domainName = 'domain.net';
  var ttl = 100;
  var service = '_sip';
  var proto = '_udp';
  var priority = 10;
  var weight = 5;
  var target = 'target.org';

  var factoryFn = function() {
    srvRecord = new jssip.net.SrvRecord(
        domainName, ttl, service, proto, priority, weight, target);
    return srvRecord;
  };
  beforeEach(factoryFn);

  describe('getters', function() {
    it('should return SRV record valeus', function() {
      expect(srvRecord.getService()).toBe(service);
      expect(srvRecord.getProto()).toBe(proto);
      expect(srvRecord.getPriority()).toBe(priority);
      expect(srvRecord.getWeight()).toBe(weight);
      expect(srvRecord.getTarget()).toBe(target);
    });
  });

  jssip.testing.shared.ResourceRecordSpec.runSpecs(
      factoryFn, domainName, ttl, jssip.net.ResourceRecord.RecordType.SRV);
});
