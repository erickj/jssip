goog.provide('jssip.sip.protocol.DialogSpec');

goog.require('jssip.sip.protocol.Dialog');

describe('jssip.sip.protocol.Dialog', function() {
  var dialog;
  var callId;
  var remoteTag;
  var localTag;
  var sequenceNumber;
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
    sequenceNumber = 42;
    localUri = /** @type {!jssip.uri.Uri} */ ({});
    remoteUri = /** @type {!jssip.uri.Uri} */ ({});
    remoteTarget = /** @type {!jssip.uri.Uri} */ ({});
    isSecure = false;
    routeSet = /** @type {!jssip.sip.protocol.RouteSet} */ ({});
    state = jssip.sip.protocol.Dialog.State.CONFIRMED;

    dialog = new jssip.sip.protocol.Dialog(callId, remoteTag, localTag,
        sequenceNumber, localUri, remoteUri, remoteTarget, isSecure, routeSet,
        state);
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

    describe('#getSequenceNumber', function() {
      it('gets the SequenceNumber', function() {
        expect(dialog.getSequenceNumber()).toBe(sequenceNumber);
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

    describe('#isOutOfDialog', function() {
      it('returns false', function() {
        expect(dialog.isOutOfDialog()).toBe(false);
      });
    });
  });
});
