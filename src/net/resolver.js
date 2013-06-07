goog.provide('jssip.net.Resolver');



/**
 * @interface
 */
jssip.net.Resolver = function() {};


/** @enum {string} */
jssip.net.Resolver.ResourceRecordType = {
  A: 'A',
  AAAA: 'AAAA',
  SRV: 'SRV',
  NAPTR: 'NAPTR'
}


/**
 * @param {string} domain
 * @param {jssip.net.Resolver.ResourceRecordType} rrtype
 * @return {!goog.async.Deferred}
 */
jssip.net.Resolver.prototype.lookup = goog.abstractMethod;
