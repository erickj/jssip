goog.provide('jssip.sip.plugin.core.MessageDestinationFetcher');

goog.require('goog.net.IpAddress');
goog.require('jssip.async.Promise');
goog.require('jssip.net.ResourceRecord');
goog.require('jssip.net.Socket');
goog.require('jssip.sip.protocol.MessageDestination');
goog.require('jssip.sip.protocol.header.NameAddrListHeader');
goog.require('jssip.sip.protocol.rfc3261');



/**
 * @see {http://tools.ietf.org/html/rfc3261#section-8.1.2}
 *
 * The destination for the request is then computed.  Unless there is
 * local policy specifying otherwise, the destination MUST be determined
 * by applying the DNS procedures described in [4] as follows.  If the
 * first element in the route set indicated a strict router (resulting
 * in forming the request as described in Section 12.2.1.1), the
 * procedures MUST be applied to the Request-URI of the request.
 * Otherwise, the procedures are applied to the first Route header field
 * value in the request (if one exists), or to the request's Request-URI
 * if there is no Route header field present.  These procedures yield an
 * ordered set of address, port, and transports to attempt.  Independent
 * of which URI is used as input to the procedures of [4], if the
 * Request-URI specifies a SIPS resource, the UAC MUST follow the
 * procedures of [4] as if the input URI were a SIPS URI.
 *
 * Local policy MAY specify an alternate set of destinations to attempt.
 * If the Request-URI contains a SIPS URI, any alternate destinations
 * MUST be contacted with TLS.  Beyond that, there are no restrictions
 * on the alternate destinations if the request contains no Route header
 * field.  This provides a simple alternative to a pre-existing route
 * set as a way to specify an outbound proxy.  However, that approach
 * for configuring an outbound proxy is NOT RECOMMENDED; a pre-existing
 * route set with a single URI SHOULD be used instead.  If the request
 * contains a Route header field, the request SHOULD be sent to the
 * locations derived from its topmost value, but MAY be sent to any
 * server that the UA is certain will honor the Route and Request-URI
 * policies specified in this document (as opposed to those in RFC
 * 2543).  In particular, a UAC configured with an outbound proxy SHOULD
 * attempt to send the request to the location indicated in the first
 * Route header field value instead of adopting the policy of sending
 * all messages to the outbound proxy
 *
 * @param {!jssip.net.Resolver} resolver
 * @param {!jssip.sip.SipContext} sipContext
 * @param {!jssip.parser.ParserRegistry} parserRegistry
 * @constructor
 */
jssip.sip.plugin.core.MessageDestinationFetcher =
    function(resolver, sipContext, parserRegistry) {
  /** @private {!jssip.net.Resolver} */
  this.resolver_ = resolver;

  /** @private {!jssip.sip.SipContext} */
  this.sipContext_ = sipContext;

  /** @private {!jssip.parser.ParserRegistry} */
  this.parserRegistry_ = parserRegistry;
};


/**
 * @const {string}
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.TPORT_PARAM_ = 'transport';


/**
 * @const {!Object.<jssip.net.Socket.Type>}
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.TPORT_TO_SOCKET_MAP_ = {
  udp: jssip.net.Socket.Type.UDP,
  tcp: jssip.net.Socket.Type.TCP,
  tls: jssip.net.Socket.Type.TLS
};


/**
 * Fetches message destinations for a request.
 * @param {!jssip.message.MessageContext} requestMessageContext
 * @return {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.MessageDestination>>}
 *     The message destinations.
 */
jssip.sip.plugin.core.MessageDestinationFetcher.prototype.
    fetchDestinationsForRequest = function(requestMessageContext) {
  /** @type {!jssip.uri.Uri} */
  var destinationUri;
  if (!requestMessageContext.isStrictRouting()) {
    var routeHeaders = requestMessageContext.getParsedHeader(
        jssip.sip.protocol.rfc3261.HeaderType.ROUTE);
    if (routeHeaders.length && routeHeaders[0] instanceof
        jssip.sip.protocol.header.NameAddrListHeader) {
      var nameAddr =
          /** @type {!jssip.sip.protocol.header.NameAddrListHeader} */ (
              routeHeaders[0]).getNameAddrList()[0];
      if (nameAddr) {
        destinationUri = nameAddr.getUri();
      }
    }
  }

  // Either the message is strict routing or there were no Route headers
  if (!destinationUri) {
    destinationUri = this.parserRegistry_.parseUri(
        requestMessageContext.getRequestUri());
  }

  return this.fetchDestinationsForUri_(destinationUri);
};


/**
 * @param {!jssip.uri.Uri} uri
 * @return {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.MessageDestination>>}
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.prototype.
    fetchDestinationsForUri_ = function(uri) {
  var hostname = uri.getHost();
  var port = uri.getPort();
  var transport = uri.getParameter(
      jssip.sip.plugin.core.MessageDestinationFetcher.TPORT_PARAM_);
  transport = goog.isString(transport) ? transport : '';

  var ipAddress = goog.net.IpAddress.fromString(hostname);
  if (ipAddress) {
    // Woohoo - It looks like an IP address
    return jssip.async.Promise.succeed(
        [this.buildMessageDestination_(ipAddress, port, transport)]);
  }

  // TODO: eventually this needs to implement the procedures in 3263
  // @see http://tools.ietf.org/html/rfc3263#section-4
  var promiseOfResourceRecords =
      this.resolver_.lookup(hostname, jssip.net.ResourceRecord.RecordType.A);
  return promiseOfResourceRecords.thenBranch(goog.bind(
      this.convertResourceRecordsToMessageDestinations_, this, port,
      transport));
};


/**
 * Builds a message destination.
 * @param {!goog.net.IpAddress} ipAddress
 * @param {number} port Port might be NaN.
 * @param {string} transport Transport might be empty.
 * @return {!jssip.sip.protocol.MessageDestination}
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.prototype.
    buildMessageDestination_ = function(ipAddress, port, transport) {
  transport = transport || this.sipContext_.getDefaultTransportType();
  port = isNaN(port) ?
      this.sipContext_.getDefaultPortForTransport(transport) :
      port;
  var socketType = jssip.sip.plugin.core.MessageDestinationFetcher.
      TPORT_TO_SOCKET_MAP_[transport];
  if (!socketType) {
    throw new Error('Unknown socket type for transport ' + transport);
  }
  return new jssip.sip.protocol.MessageDestination(ipAddress, port, socketType);
};


/**
 * @param {number} port Port might be NaN
 * @param {string} transport Transport might be empty
 * @param {!Array.<!jssip.net.ResourceRecord>} resourceRecords
 * @return {!Array.<!jssip.sip.protocol.MessageDestination>}
 * @throws {Error} if it can't handle a resource record type
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.prototype.
    convertResourceRecordsToMessageDestinations_ =
        function(port, transport, resourceRecords) {
  var messageDestinations = [];
  for (var i = 0; i < resourceRecords.length; i++) {
    switch(resourceRecords[i].getType()) {
      case jssip.net.ResourceRecord.RecordType.A:
        messageDestinations.push(this.convertARecordToMessageDestination_(
            port, transport,
            /** @type {!jssip.net.ARecord} */ (resourceRecords[i])));
        break;
      default:
        throw new Error('Invalid resource record type');
    }
  }
  return messageDestinations;
};


/**
 * @param {number} port Port might be NaN
 * @param {string} transport Transport might be empty
 * @param {!jssip.net.ARecord} aRecord
 * @return {!jssip.sip.protocol.MessageDestination}
 * @throws {Error} if the A record's IP address doesn't parse properly
 * @private
 */
jssip.sip.plugin.core.MessageDestinationFetcher.prototype.
    convertARecordToMessageDestination_ = function(port, transport, aRecord) {
  var ipAddress = goog.net.IpAddress.fromString(aRecord.getIpAddress());
  if (!ipAddress) {
    throw new Error('No ip address for A record');
  }
  return this.buildMessageDestination_(ipAddress, port, transport);
};
