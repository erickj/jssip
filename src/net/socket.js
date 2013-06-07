goog.provide('jssip.net.Socket');



/**
 * @interface
 */
jssip.net.Socket = function() {};


/** @enum {string} */
jssip.net.Socket.EventType = {
  RECEIVEMESSAGE: 'socketreceivemessage'
};


/** @enum {string} */
jssip.net.Socket.Type = {
  UDP: 'udp',
  TCP: 'tcp',
  TLS: 'tls'
};


/**
 * @param {string} data
 */
jssip.net.Socket.prototype.write = goog.abstractMethod;


/**
 * @param {string} data
 * @param {string} host
 * @param {number} port
 */
jssip.net.Socket.prototype.receive = goog.abstractMethod;


/**
 * Bind the socket to the local hostname/port pair.
 * @param {string} hostname
 * @param {number} port
 */
jssip.net.Socket.prototype.bind = goog.abstractMethod;


/**
 * Connect the socket to the remote hostname/port pair.
 * @param {string} hostname
 * @param {number} port
 */
jssip.net.Socket.prototype.connect = goog.abstractMethod;


/**
 * Closes the socket.
 */
jssip.net.Socket.prototype.close = goog.abstractMethod;
