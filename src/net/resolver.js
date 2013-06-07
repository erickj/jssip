goog.provide('jssip.net.Resolver');



/**
 * @interface
 */
jssip.net.Resolver = function() {};


/**
 * @param {string} domain
 * @param {jssip.net.Resolver.ResourceRecordType} rrtype
 * @return {!goog.async.Deferred}
 */
jssip.net.Resolver.prototype.lookup = goog.abstractMethod;
