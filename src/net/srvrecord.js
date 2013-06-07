goog.provide('jssip.net.SrvRecord');

goog.require('jssip.net.ResourceRecord');



/**
 * An SRV Record.
 * @see http://tools.ietf.org/html/rfc2782
 * @param {string} domainName
 * @param {number} ttl
 * @param {string} service
 * @param {string} proto
 * @param {number} priority
 * @param {number} weight
 * @param {string} target
 * @constructor
 * @extends {jssip.net.ResourceRecord}
 */
jssip.net.SrvRecord =
    function(domainName, ttl, service, proto, priority, weight, target) {
  var propertyName = jssip.net.SrvRecord.PropertyName;
  var propertyMap = {};
  propertyMap[propertyName.SERVICE] = service;
  propertyMap[propertyName.PROTO] = proto;
  propertyMap[propertyName.PRIORITY] = priority;
  propertyMap[propertyName.WEIGHT] = weight;
  propertyMap[propertyName.TARGET] = target;
  goog.base(this,
      jssip.net.ResourceRecord.RecordType.SRV, domainName, ttl, propertyMap);
};
goog.inherits(jssip.net.SrvRecord, jssip.net.ResourceRecord);


/** @enum {string} */
jssip.net.SrvRecord.PropertyName = {
  SERVICE: 'srv-service',
  PROTO: 'srv-proto',
  PRIORITY: 'srv-priority',
  WEIGHT: 'srv-weight',
  TARGET: 'srv-target'
};


/** @return {string} */
jssip.net.SrvRecord.prototype.getService = function() {
  return /** @type {string} */ (
      this.get(jssip.net.SrvRecord.PropertyName.SERVICE));
};


/** @return {string} */
jssip.net.SrvRecord.prototype.getProto = function() {
  return /** @type {string} */ (
      this.get(jssip.net.SrvRecord.PropertyName.PROTO));
};


/** @return {number} */
jssip.net.SrvRecord.prototype.getPriority = function() {
  return /** @type {number} */ (
      this.get(jssip.net.SrvRecord.PropertyName.PRIORITY));
};


/** @return {number} */
jssip.net.SrvRecord.prototype.getWeight = function() {
  return /** @type {string} */ (
      this.get(jssip.net.SrvRecord.PropertyName.WEIGHT));
};


/** @return {string} */
jssip.net.SrvRecord.prototype.getTarget = function() {
  return /** @type {string} */ (
      this.get(jssip.net.SrvRecord.PropertyName.TARGET));
};
