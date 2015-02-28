goog.provide('jssip.sip.plugin.transport.ServerLocate');
goog.provide('jssip.sip.plugin.transport.ServerLocate.Facade_');

goog.require('jssip.plugin.AbstractFeature');
goog.require('jssip.plugin.FeatureFacade');
goog.require('jssip.sip.plugin.transport.pluginfeature');
goog.require('jssip.sip.plugin.transport.pluginfeature.ServerLocate');



/**
 * An implementation of the SIP server location features defined in RFC 3263.
 * @param {string} name
 * @constructor
 * @extends {jssip.plugin.AbstractFeature}
 */
jssip.sip.plugin.transport.ServerLocateFeature = function(name) {
  var featureTypes = [
      jssip.sip.plugin.transport.pluginfeature.Type.ServerLocate
  ];
  goog.base(this, name, this.facade_, undefined /* opt_eventHandlerMap */,
            featureTypes);
};


/**
 * RFC 3263 Details the client process for locating SIP servers
 *
 * @see http://tools.ietf.org/html/rfc3263#section-4
 * @param {!jssip.uri.Uri} uri
 * @return {!jssip.async.Promise.<!Array.<!jssip.sip.protocol.LookupResult>>}
 * @private
 */
jssip.sip.plugin.transport.ServerLocateFeature.prototype.
    locateSipServerForUri = function(uri) {
  var ipAddress = goog.net.IpAddress.fromString(uri.getHost());
  if (ipAddress) {
    var port = uri.getPort() || 5060;
    var protocol = jssip.net.Socket.Type.UDP;
    return jssip.async.Promise.succeed(
        [new jssip.sip.protocol.LookupResult(ipAddress, port, protocol)]);
  }
  // TODO(erick): lots...
  return jssip.async.Promise.succeed([
      new jssip.sip.protocol.LookupResult(
          new goog.net.Ipv4Address('0.0.0.0'),
          5060,
          jssip.net.Socket.Type.UDP)]);
};



/**
 * @param {!jssip.sip.plugin.transport.ServerLocateFeature} delegate
 * @constructor
 * @private
 * @implements {jssip.plugin.FeatureFacade}
 * @implements {jssip.sip.plugin.transport.pluginfeature.ServerLocate}
 */
jssip.sip.plugin.transport.ServerLocateFeature.Facade_ = function(delegate) {
  /** @private {!jssip.sip.plugin.transport.ServerLocateFeature} */
  this.delgate_ = delegate;
};


/** @override */
jssip.sip.plugin.transport.ServerLocateFeature.prototype.locateSipServerForUri =
    function(uri) {
  return this.delegate_.locateSipServerForUri(uri);
};
