goog.provide('jssip.testing.util.netutil');
goog.provide('jssip.testing.util.netutil.StubResolver');

goog.require('goog.async.Deferred');
goog.require('goog.object');
goog.require('jssip.async.Promise');
goog.require('jssip.net.ARecord');
goog.require('jssip.net.Resolver');
goog.require('jssip.net.ResourceRecord');


/**
 * @param {!Object.<!Array.<string>>} aRecordMap A map of domain names to arrays
 *     of IP address to return for lookups. If a domain isn't in the map a
 *     failed promise will be returned.
 * @constructor
 * @implements {jssip.net.Resolver}
 */
jssip.testing.util.netutil.StubResolver = function(aRecordMap) {
  /** @private {!Object.<!jssip.net.ARecord>} */
  this.aRecordMap_ = {};
  for (var domain in aRecordMap) {
    this.aRecordMap_[domain] = [];
    var ips = aRecordMap[domain];
    for (var i = 0; i < ips.length; i++) {
      this.aRecordMap_[domain].push(
          new jssip.net.ARecord(domain, 100, ips[i]));
    }
  }
};


/**
 * Responds with populated arrays for A record and SRV record lookups for
 * domains foo.com and sip.foo.com.
 * @override
 */
jssip.testing.util.netutil.StubResolver.prototype.lookup =
    function(domain, rrtype) {
  var result = [];
  switch (rrtype) {
    case jssip.net.ResourceRecord.ResourceType.A:
      result = this.aRecordMap_[domain];
      break;
    default:
      throw new Error('Unhandled record type: ' + rrtype);
  }
  if (!result.length) {
    return new jssip.async.Promise(goog.async.Deferred.fail(
        new Error('StubResolver has no records')));
  }
  return jssip.async.Promise.succeed(result);
};
