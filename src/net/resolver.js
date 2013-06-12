goog.provide('jssip.net.Resolver');



/**
 * @interface
 */
jssip.net.Resolver = function() {};


/**
 * @param {string} domain
 * @param {jssip.net.ResourceRecord.RecordType} rrtype
 * @return {!jssip.async.Promise.<!jssip.net.ResourceRecord>}
 */
jssip.net.Resolver.prototype.lookup = goog.abstractMethod;
