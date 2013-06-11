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
 * Sends a message to the network. Returns a deferred that represents the
 * eventual acknowledgement the request was sent or an error occurred in
 * transmission.  This does NOT indicate the response at the application (SIP)
 * level.
 * @param {!jssip.message.BuilderMessageContext} messageContext
 * @return {!goog.async.Deferred}
 */
jssip.sip.protocol.TransportLayer.prototype.send = goog.abstractMethod;
