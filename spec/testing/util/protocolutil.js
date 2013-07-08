goog.provide('jssip.testing.util.protocolutil');

goog.require('jssip.sip.protocol.Dialog');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.Route');
goog.require('jssip.sip.protocol.RouteSet');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');


/**
 * @param {boolean} hasStrictRoutes
 * @param {!jssip.uri.UriParser=} opt_uriParameterParser
 * @return {!jssip.sip.protocol.Dialog}
 */
jssip.testing.util.protocolutil.createDummyDialog =
    function(hasStrictRoutes, opt_uriParameterParser) {
  var callId = 'abc.callid.123';
  var remoteTag = 'remote.tag';
  var localTag = 'local.tag';
  var localSequenceNumber = 42;
  var remoteSequenceNumber = 24;
  var localUri = new jssip.uri.Uri.Builder().
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
      addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'local').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'dialog.uri').
      build();
  var remoteUri = new jssip.uri.Uri.Builder().
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
      addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'remote').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'dialog.uri').
      build();
  var remoteTarget = new jssip.uri.Uri.Builder().
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
      addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'remotetarget').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'dialog.target').
      build();
  var isSecure = false;

  var routeParams = hasStrictRoutes ? '' : ';lr';
  var routeUri1Builder = (new jssip.uri.Uri.Builder()).
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'dialog.route1').
      addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS, routeParams);
  var routeUri2Builder = (new jssip.uri.Uri.Builder()).
      addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
      addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'dialog.route2').
      addPropertyPair(jssip.uri.Uri.PropertyName.PARAMETERS, routeParams);

  if (opt_uriParameterParser) {
    routeUri1Builder.addUriParser(opt_uriParameterParser);
    routeUri2Builder.addUriParser(opt_uriParameterParser);
  }
  var routeUri1 = routeUri1Builder.build();
  var routeUri2 = routeUri2Builder.build();

  var route1 = new jssip.sip.protocol.Route(
      new jssip.sip.protocol.NameAddr(routeUri1));
  var route2 = new jssip.sip.protocol.Route(
      new jssip.sip.protocol.NameAddr(routeUri2));

  var routeSet = new jssip.sip.protocol.RouteSet([route1, route2]);
  var state = jssip.sip.protocol.Dialog.State.CONFIRMED;

  return new jssip.sip.protocol.Dialog(callId, remoteTag, localTag,
      localSequenceNumber, remoteSequenceNumber, localUri, remoteUri,
      remoteTarget, isSecure, routeSet, state);
};
