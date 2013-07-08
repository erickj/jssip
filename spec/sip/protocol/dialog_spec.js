goog.provide('jssip.sip.protocol.DialogSpec');

goog.require('jssip.sip.protocol.Dialog');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.uri.Uri');
goog.require('jssip.uri.Uri.Builder');

describe('jssip.sip.protocol.Dialog', function() {
  var dialog;
  var callId;
  var remoteTag;
  var localTag;
  var localSequenceNumber;
  var remoteSequenceNumber;
  var localUri;
  var remoteUri;
  var remoteTarget;
  var isSecure;
  var routeSet;
  var state;

  beforeEach(function() {
    callId = 'abc.callid.123';
    remoteTag = 'remote.tag';
    localTag = 'local.tag';
    localSequenceNumber = 42;
    remoteSequenceNumber = 24;
    localUri = new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
        addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'local').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'uri.net').
        build();
    remoteUri = new jssip.uri.Uri.Builder().
        addPropertyPair(jssip.uri.Uri.PropertyName.SCHEME, 'sip').
        addPropertyPair(jssip.uri.Uri.PropertyName.USER, 'remote').
        addPropertyPair(jssip.uri.Uri.PropertyName.HOST, 'uri.gov').
        build();
    remoteTarget = /** @type {!jssip.uri.Uri} */ ({});
    isSecure = false;
    routeSet = /** @type {!jssip.sip.protocol.RouteSet} */ ({});
    state = jssip.sip.protocol.Dialog.State.CONFIRMED;

    dialog = new jssip.sip.protocol.Dialog(callId, remoteTag, localTag,
        localSequenceNumber, remoteSequenceNumber, localUri, remoteUri,
        remoteTarget, isSecure, routeSet, state);
  });

  describe('getters', function() {
    describe('#getCallId', function() {
      it('gets the CallId', function() {
        expect(dialog.getCallId()).toBe(callId);
      });
    });

    describe('#getRemoteTag', function() {
      it('gets the RemoteTag', function() {
        expect(dialog.getRemoteTag()).toBe(remoteTag);
      });
    });

    describe('#getLocalTag', function() {
      it('gets the LocalTag', function() {
        expect(dialog.getLocalTag()).toBe(localTag);
      });
    });

    describe('#getLocalSequenceNumber', function() {
      it('gets the local SequenceNumber', function() {
        expect(dialog.getLocalSequenceNumber()).toBe(localSequenceNumber);
      });
    });

    describe('#getRemoteSequenceNumber', function() {
      it('gets the remote SequenceNumber', function() {
        expect(dialog.getRemoteSequenceNumber()).toBe(remoteSequenceNumber);
      });
    });

    describe('#getLocalUri', function() {
      it('gets the LocalUri', function() {
        expect(dialog.getLocalUri()).toBe(localUri);
      });
    });

    describe('#getRemoteUri', function() {
      it('gets the RemoteUri', function() {
        expect(dialog.getRemoteUri()).toBe(remoteUri);
      });
    });

    describe('#getRemoteTarget', function() {
      it('gets the RemoteTarget', function() {
        expect(dialog.getRemoteTarget()).toBe(remoteTarget);
      });
    });

    describe('#getIsSecure', function() {
      it('gets the IsSecure', function() {
        expect(dialog.getIsSecure()).toBe(isSecure);
      });
    });

    describe('#getRouteSet', function() {
      it('gets the RouteSet', function() {
        expect(dialog.getRouteSet()).toBe(routeSet);
      });
    });

    describe('#getState', function() {
      it('gets the State', function() {
        expect(dialog.getState()).toBe(state);
      });
    });

    describe('#getToNameAddr', function() {
      it('returns a NameAddr from the remote uri/tag for requests', function() {
        var nameAddr = dialog.getToNameAddr(true /* isRequest */);
        expect(nameAddr).toEqual(jasmine.any(jssip.sip.protocol.NameAddr));
        expect(
            nameAddr.stringify()).toBe('<sip:remote@uri.gov>;tag=remote.tag');
      });

      it('returns a NameAddr from the local uri/tag for responses', function() {
        var nameAddr = dialog.getToNameAddr(false /* isRequest */);
        expect(nameAddr).toEqual(jasmine.any(jssip.sip.protocol.NameAddr));
        expect(
            nameAddr.stringify()).toBe('<sip:local@uri.net>;tag=local.tag');
      });
    });

    describe('#getFromNameAddr', function() {
      it('returns a NameAddr from the local uri/tag for requests', function() {
        var nameAddr = dialog.getFromNameAddr(true /* isRequest */);
        expect(nameAddr).toEqual(jasmine.any(jssip.sip.protocol.NameAddr));
        expect(
            nameAddr.stringify()).toBe('<sip:local@uri.net>;tag=local.tag');
      });

      it('returns a NameAddr from the remote uri/tag for response', function() {
        var nameAddr = dialog.getFromNameAddr(false /* isRequest */);
        expect(nameAddr).toEqual(jasmine.any(jssip.sip.protocol.NameAddr));
        expect(
            nameAddr.stringify()).toBe('<sip:remote@uri.gov>;tag=remote.tag');
      });
    });
  });
});
