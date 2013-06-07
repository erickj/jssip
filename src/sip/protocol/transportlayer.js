goog.provide('jssip.sip.protocol.TransportLayer');



/**
 * {@see http://tools.ietf.org/html/rfc3261#section-18}
 *
 * @interface
 */
jssip.sip.protocol.TransportLayer = function() {};


/** @enum {string} */
jssip.sip.protocol.TransportLayer.EventType = {
  RECEIVE_MESSAGE: 'transportlayer-receivemessage',
  SENT_MESSAGE: 'transportlayer-sentmessage'
};


/**
 * Sends a message to the network.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.TransportLayer.prototype.send = goog.abstractMethod;
