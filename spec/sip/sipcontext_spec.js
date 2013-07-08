goog.provide('jssip.sip.SipContextSpec');

goog.require('goog.testing.MockControl');
goog.require('jssip.sip.SipContext');
goog.require('jssip.sip.protocol.storage.DialogStorage');

describe('jssip.sip.SipContext', function() {
  var sipContext;
  var storage;
  var preloadedRoutes;
  var mockControl;

  beforeEach(function() {
    storage = /** @type {!jssip.storage.Storage} */ ({});
    mockControl = new goog.testing.MockControl();
    preloadedRoutes = [];
  });

  afterEach(function() {
    mockControl.$tearDown();
  });

  describe('new', function() {
    var dialogStorage;

    beforeEach(function() {
      dialogStorage = {};

      var DialogStorageCtor = mockControl.createConstructorMock(
          jssip.sip.protocol.storage, 'DialogStorage');
      DialogStorageCtor(storage).$returns(dialogStorage);
    });

    it('instantiates a SipContext',
       function() {
         mockControl.$replayAll();

         sipContext = new jssip.sip.SipContext(storage, preloadedRoutes);

         mockControl.$verifyAll();
       });
  });

  describe('#getDialogStorage', function() {
    it('gets the created dialog storage', function() {
      sipContext = new jssip.sip.SipContext(storage, preloadedRoutes);
      expect(sipContext.getDialogStorage()).toEqual(
          jasmine.any(jssip.sip.protocol.storage.DialogStorage));
    });
  });

  describe('#getPreloadedRoutes', function() {
    it('gets the preloaded routes', function() {
      sipContext = new jssip.sip.SipContext(storage, preloadedRoutes);
      expect(sipContext.getPreloadedRoutes()).toBe(preloadedRoutes);
    });
  });
});
