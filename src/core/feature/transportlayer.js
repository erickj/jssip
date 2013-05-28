goog.provide('jssip.core.feature.TransportLayer');



/**
 * {@see http://tools.ietf.org/html/rfc3261#section-18}
 *
 * @interface
 */
jssip.core.feature.TransportLayer = function() {};


/** @enum {string} */
jssip.core.feature.TransportLayer.EventType = {
  RECEIVE_MESSAGE: 'transportlayer-receivemessage',
  SENT_MESSAGE: 'transportlayer-sentmessage'
};


/**
 * Write a message to the network.
 * @param {!jssip.message.MessageContext} messageContext
 */
jssip.core.feature.TransportLayer.prototype.write = function(messageContext) {};


/**
 * Read a message from the network
 * @return {!jssip.message.MessageContext}
 */
jssip.core.feature.TransportLayer.prototype.read = function() {};
