goog.provide('jssip.testing.util.netutil');
goog.provide('jssip.testing.util.netutil.StubResolver');

goog.require('goog.object');
goog.require('jssip.async.Promise');
goog.require('jssip.net.ARecord');
goog.require('jssip.net.Resolver');
goog.require('jssip.net.ResourceRecord');
goog.require('jssip.net.Socket');
goog.require('jssip.net.SrvRecord');


/**
 * @constructor
 * @implements {jssip.net.Resolver}
 */
jssip.testing.util.netutil.StubResolver = function() {
  var domain = 'foo.com';

  /** @private {!Object.<!jssip.net.ARecord>} */
  this.aRecordMap_ = {};
  this.aRecordMap_[domain] = [
    new jssip.net.ARecord(domain, 100, '1.2.3.4')
  ];

  var srvDomain = 'sip.' + domain;
  /** @private {!Object.<!jssip.net.SrvRecord>} */
  this.srvRecordMap_ = {};
  this.srvRecordMap_[domain] = [
    new jssip.net.SrvRecord(srvDomain, 200, '_sip', '_udp', 10, 20, 2121, domain)
  ];
};


/**
 * Responds with populated arrays for A record and SRV record lookups for
 * domains foo.com and sip.foo.com.
 * @override
 */
jssip.testing.util.netutil.StubResolver.prototype.lookup =
    function(domain, rrtype) {
  var result = [];
  if (jssip.net.ResourceRecord.ResourceType.A == rrtype) {
    result = this.aRecordMap_[domain];
  } else if (jssip.net.ResourceRecord.ResourceType.SRV == rrtype) {
    result = this.srvRecordMap_[domain];
  }
  return jssip.async.Promise.succeed(result);
};
