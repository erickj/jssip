goog.provide('jssip.net.TransportManager');



/**
 * @interface
 */
jssip.net.TransportManager = function() {};


/** @enum {string} */
jssip.net.TransportManager.EventType = {
  MESSAGE: 'transportmessage'
};


/**
 * Reads the last received message from the transport layer.
 * @return {string}
 */
jssip.net.TransportManager.prototype.read = goog.nullFunction;


/**
 * Writes a message to the transport layer.
 * @param {string} message
 */
jssip.net.TransportManager.prototype.write = goog.nullFunction;


// TODO(erick): Fix this up once an implementation shows up.
/**
 * @param {...*} var_args
 */
jssip.net.TransportManager.prototype.addEventListener = goog.nullFunction;
