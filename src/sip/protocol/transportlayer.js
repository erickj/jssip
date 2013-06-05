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
 * Write a message to the network.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.protocol.TransportLayer.prototype.write = function(messageContext) {};


/**
 * Read a message from the network
 * @return {!jssip.message.MessageContext}
 */
jssip.sip.protocol.TransportLayer.prototype.read = function() {};