goog.provide('jssip.net.ARecord');

goog.require('jssip.net.ResourceRecord');



/**
 * @see http://tools.ietf.org/html/rfc1035 Section 3.4.1
 * @param {string} domainName
 * @param {number} ttl
 * @param {string} ip4Address
 * @constructor
 * @extends {jssip.net.ResourceRecord}
 */
jssip.net.ARecord = function(domainName, ttl, ip4Address) {
  var propertyName = jssip.net.ARecord.PropertyName;
  var propertyMap = {};
  propertyMap[propertyName.IPADDRESS] = ip4Address;
  goog.base(this,
      jssip.net.ResourceRecord.RecordType.A, domainName, ttl, propertyMap);
};
goog.inherits(jssip.net.ARecord, jssip.net.ResourceRecord);


/** @enum {string} */
jssip.net.ARecord.PropertyName = {
  IPADDRESS: 'a-ip4address'
};


/** @return {string} */
jssip.net.ARecord.prototype.getIpAddress = function() {
  return /** @type {string} */ (
      this.get(jssip.net.ARecord.PropertyName.IPADDRESS));
};
