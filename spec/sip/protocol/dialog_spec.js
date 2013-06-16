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

    dialog = new jssip.sip.protocol.Dialog(callId, remoteTag, localTag,
        sequenceNumber, localUri, remoteUri, remoteTarget, isSecure, routeSet);
  });

  describe('getters', function() {
    describe('#getCallId', function() {
      it('should get the CallId', function() {
        expect(dialog.getCallId()).toBe(callId);
      });
    });

    describe('#getRemoteTag', function() {
      it('should get the RemoteTag', function() {
        expect(dialog.getRemoteTag()).toBe(remoteTag);
      });
    });

    describe('#getLocalTag', function() {
      it('should get the LocalTag', function() {
        expect(dialog.getLocalTag()).toBe(localTag);
      });
    });

    describe('#getSequenceNumber', function() {
      it('should get the SequenceNumber', function() {
        expect(dialog.getSequenceNumber()).toBe(sequenceNumber);
      });
    });

    describe('#getLocalUri', function() {
      it('should get the LocalUri', function() {
        expect(dialog.getLocalUri()).toBe(localUri);
      });
    });

    describe('#getRemoteUri', function() {
      it('should get the RemoteUri', function() {
        expect(dialog.getRemoteUri()).toBe(remoteUri);
      });
    });

    describe('#getRemoteTarget', function() {
      it('should get the RemoteTarget', function() {
        expect(dialog.getRemoteTarget()).toBe(remoteTarget);
      });
    });

    describe('#getIsSecure', function() {
      it('should get the IsSecure', function() {
        expect(dialog.getIsSecure()).toBe(isSecure);
      });
    });

    describe('#getRouteSet', function() {
      it('should get the RouteSet', function() {
        expect(dialog.getRouteSet()).toBe(routeSet);
      });
    });

    describe('#getState', function() {
      it('should get the State', function() {
        expect(dialog.getState()).toBe(jssip.sip.protocol.Dialog.State.NULL);
      });
    });
  });
});
