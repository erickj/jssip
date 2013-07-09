goog.provide('jssip.net.ResourceRecord');

goog.require('jssip.util.PropertyHolder');



/**
 * An answer for a resource record lookup.
 * @see http://tools.ietf.org/html/rfc1035
 * @param {jssip.net.ResourceRecord.RecordType} recordType
 * @param {string} domainName The domain name to which this record refers.
 * @param {number} ttl The time to cache this record in seconds.
 * @param {!Object.<(string|number)>} propertyMap Record type property values.
 * @constructor
 * @extends {jssip.util.PropertyHolder}
 */
jssip.net.ResourceRecord = function(recordType, domainName, ttl, propertyMap) {
  var propertyName = jssip.net.ResourceRecord.PropertyName;
  propertyMap[propertyName.CLASS] = jssip.net.ResourceRecord.ResourceClass.IN;
  propertyMap[propertyName.TYPE] = recordType;
  propertyMap[propertyName.NAME] = domainName;
  propertyMap[propertyName.TTL] = ttl;
  goog.base(this, propertyMap, true /* opt_isImmutable */);
};
goog.inherits(jssip.net.ResourceRecord, jssip.util.PropertyHolder);


/**
 * @see http://www.iana.org/assignments/dns-parameters/dns-parameters.xml#dns-parameters-1
 * @enum {number}
 */
jssip.net.ResourceRecord.ResourceClass = {
  IN: 1
};


/**
 * @see http://www.iana.org/assignments/dns-parameters/dns-parameters.xml#dns-parameters-3
 * @enum {number}
 */
jssip.net.ResourceRecord.RecordType = {
  A: 1,
  SRV: 33,
  NAPTR: 35 // TODO(erick): Implement this when needed.
};


/** @enum {string} */
jssip.net.ResourceRecord.PropertyName = {
  CLASS: 'rr-class',
  NAME: 'rr-name',
  TTL: 'rr-ttl',
  TYPE: 'rr-type'
};


/** @return {string} */
jssip.net.ResourceRecord.prototype.getDomainName = function() {
  return /** @type {string} */ (
      this.get(jssip.net.ResourceRecord.PropertyName.NAME));
};


/** @return {number} */
jssip.net.ResourceRecord.prototype.getTtl = function() {
  return /** @type {number} */ (
      this.get(jssip.net.ResourceRecord.PropertyName.TTL));
};


/** @return {number} */
jssip.net.ResourceRecord.prototype.getType = function() {
  return /** @type {number} */ (
      this.get(jssip.net.ResourceRecord.PropertyName.TYPE));
};
