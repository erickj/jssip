goog.provide('jssip.sip.feature.TransportLayer');



/**
 * {@see http://tools.ietf.org/html/rfc3261#section-18}
 *
 * @interface
 */
jssip.sip.feature.TransportLayer = function() {};


/** @enum {string} */
jssip.sip.feature.TransportLayer.EventType = {
  RECEIVE_MESSAGE: 'transportlayer-receivemessage',
  SENT_MESSAGE: 'transportlayer-sentmessage'
};


/**
 * Write a message to the network.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.sip.feature.TransportLayer.prototype.write = function(messageContext) {};


/**
 * Read a message from the network
 * @return {!jssip.message.MessageContext}
 */
jssip.sip.feature.TransportLayer.prototype.read = function() {};
