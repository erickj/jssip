goog.provide('jssip.sip.protocol.storage.DialogStorageSpec');

goog.require('goog.testing.MockControl');
goog.require('goog.testing.mockmatchers.IgnoreArgument');
goog.require('goog.testing.mockmatchers.TypeOf');
goog.require('jssip.message.MessageContext');
goog.require('jssip.message.Header');
goog.require('jssip.sip.protocol.Dialog');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.storage.DialogStorage');
goog.require('jssip.storage.Storage');
goog.require('jssip.storage.SimpleMemoryStorage');

describe('jssip.sip.protocol.storage.DialogStorage', function() {
  var dialogStorage;
  var mockStorage;
  var mockControl;
  var mockDialog;
  var callId = 'callId.xyzabc';
  var localTag = 'local.tag';
  var remoteTag = 'remote.tag';

  beforeEach(function() {
    mockControl = new goog.testing.MockControl();

    mockDialog =
        mockControl.createLooseMock(jssip.sip.protocol.Dialog);
    mockDialog.getRemoteTag().$returns(remoteTag);
    mockDialog.getLocalTag().$returns(localTag);
    mockDialog.getCallId().$returns(callId);
  });

  afterEach(function() {
    mockControl.$tearDown();
  });

  describe('Dialogs', function() {
    beforeEach(function() {
      mockStorage = mockControl.createLooseMock(
        jssip.storage.Storage);
      dialogStorage = new jssip.sip.protocol.storage.DialogStorage(
        mockStorage);
    });

    describe('#setDialog', function() {
      it('sets a dialog into storage', function() {
        mockStorage.set(
            new goog.testing.mockmatchers.TypeOf("string"), mockDialog);
        mockControl.$replayAll();

        dialogStorage.setDialog(mockDialog);

        mockControl.$verifyAll();
      });
    });

    describe('#removeDialog', function() {
      it('removes a dialog that has been set', function() {
        mockStorage.remove(new goog.testing.mockmatchers.TypeOf("string"));
        mockControl.$replayAll();

        dialogStorage.removeDialog(mockDialog);

        mockControl.$verifyAll();
      });
    });
  });

  describe('MessageContexts', function() {
    var mockMessageContext;
    var mockCallIdHeader;
    var mockToHeader;
    var mockFromHeader;
    var toNameAddr;
    var fromNameAddr
    var isLocal;

    beforeEach(function() {
      dialogStorage = new jssip.sip.protocol.storage.DialogStorage(
          new jssip.storage.SimpleMemoryStorage());

      mockCallIdHeader = mockControl.createLooseMock(jssip.message.Header);
      mockCallIdHeader.getParsedValue().$returns([callId]);

      toNameAddr = {
        tag: null,
        getContextParams: function() {
          return {
            getParameter: function() { return toNameAddr.tag; }
          }
        }
      };
      fromNameAddr = {
        tag: null,
        getContextParams: function() {
          return {
            getParameter: function() { return fromNameAddr.tag; }
          }
        }
      };

      mockToHeader = mockControl.createLooseMock(
          jssip.sip.protocol.header.NameAddrHeader,
          undefined /* opt_ignoreUnexpectedCalls */,
          undefined /* opt_mockStaticMethods */,
          true /* opt_createProxy */); // Create a $proxy for the instanceof check
      mockToHeader.getNameAddr().$returns(toNameAddr);

      mockFromHeader = mockControl.createLooseMock(
          jssip.sip.protocol.header.NameAddrHeader,
          undefined /* opt_ignoreUnexpectedCalls */,
          undefined /* opt_mockStaticMethods */,
          true /* opt_createProxy */); // Create a $proxy for the instanceof check
      mockFromHeader.getNameAddr().$returns(fromNameAddr);

      mockMessageContext =
          mockControl.createLooseMock(jssip.message.MessageContext);
      mockMessageContext.
          getParsedHeader(new goog.testing.mockmatchers.IgnoreArgument()).
          $does(function(hdr) {
            switch(hdr) {
              case 'Call-ID':
                return [mockCallIdHeader];
              case 'To':
                return [mockToHeader.$proxy];
              case 'From':
                return [mockFromHeader.$proxy];
              default:
                throw new Error('Unknown header');
            };
          }).
          $times(3);
    });

    // These tests should mirror the describe block below
    describe('From is local and To is remote', function() {
      beforeEach(function() {
        toNameAddr.tag = remoteTag;
        fromNameAddr.tag = localTag;
      });

      describe('on local request', function() {
        beforeEach(function() {
          mockMessageContext.isLocal().$returns(true);
          mockMessageContext.isRequest().$returns(true);
        });

        it('returns the dialog for this message context', function() {
          mockControl.$replayAll();
          dialogStorage.setDialog(mockDialog);
          expect(dialogStorage.getDialogForMessageContext(
              mockMessageContext, isLocal)).toBe(mockDialog)
          mockControl.$verifyAll();
        });
      });

      describe('on remote response', function() {
        beforeEach(function() {
          mockMessageContext.isLocal().$returns(false);
          mockMessageContext.isRequest().$returns(false);
        });

        it('returns the dialog for this message context', function() {
          mockControl.$replayAll();
          dialogStorage.setDialog(mockDialog);
          expect(dialogStorage.getDialogForMessageContext(
              mockMessageContext, isLocal)).toBe(mockDialog)
          mockControl.$verifyAll();
        });
      });
    });

    // These tests should mirror the describe block above
    describe('To is local and From is remote', function() {
      beforeEach(function() {
        toNameAddr.tag = localTag;
        fromNameAddr.tag = remoteTag;
      });

      describe('on local response', function() {
        beforeEach(function() {
          mockMessageContext.isLocal().$returns(true);
          mockMessageContext.isRequest().$returns(false);
        });

        it('returns the dialog for this message context', function() {
          mockControl.$replayAll();
          dialogStorage.setDialog(mockDialog);
          expect(dialogStorage.getDialogForMessageContext(
              mockMessageContext, isLocal)).toBe(mockDialog)
          mockControl.$verifyAll();
        });
      });

      describe('on remote request', function() {
        beforeEach(function() {
          mockMessageContext.isLocal().$returns(false);
          mockMessageContext.isRequest().$returns(true);
        });

        it('returns the dialog for this message context', function() {
          mockControl.$replayAll();
          dialogStorage.setDialog(mockDialog);
          expect(dialogStorage.getDialogForMessageContext(
              mockMessageContext, isLocal)).toBe(mockDialog)
          mockControl.$verifyAll();
        });
      });
    });
  });
});
