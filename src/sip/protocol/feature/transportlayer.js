goog.provide('jssip.sip.protocol.feature.TransportLayer');



/**
 * {@see http://tools.ietf.org/html/rfc3261#section-18}
 *
 * @interface
 */
jssip.sip.protocol.feature.TransportLayer = function() {};


/** @const {string} */
jssip.sip.protocol.feature.TransportLayer.TYPE = 'feature-transportlayer';


/** @enum {string} */
jssip.sip.protocol.feature.TransportLayer.EventType = {
  RECEIVE_MESSAGE: 'transportlayer-receivemessage',
  SENT_MESSAGE: 'transportlayer-sentmessage'
};


/**
 * Sends a message to the network. Returns a deferred that represents the
 * eventual acknowledgement the request was sent or an error occurred in
 * transmission.  This does NOT indicate the response at the application (SIP)
 * level.
 * @param {!jssip.sip.protocol.MessageDestination} destination
 * @param {!jssip.message.MessageContext} messageContext
 * @param {string} branchId
 * @return {!jssip.async.Promise.<!jssip.sip.event.TransportInfo>}
 */
jssip.sip.protocol.feature.TransportLayer.prototype.sendRequest =
    goog.abstractMethod;
