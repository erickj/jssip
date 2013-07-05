goog.provide('jssip.platform.PlatformContext');



/**
 * Provides access to dependencies required by JsSIP for a platform.
 * @interface
 */
jssip.platform.PlatformContext = function() {};


/**
 * Returns the socket factory registry for the platform.
 * @return {!jssip.net.SocketFactoryRegistry}
 */
jssip.platform.PlatformContext.prototype.getSocketFactoryRegistry =
    goog.abstractMethod;


/**
 * Returns the DNS resolver for the platform.
 * @return {!jssip.net.Resolver}
 */
jssip.platform.PlatformContext.prototype.getResolver = goog.abstractMethod;
