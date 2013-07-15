goog.provide('jssip.async.PromiseSpec');

goog.require('goog.async.Deferred');
goog.require('jssip.async.Promise');

describe('jssip.async.Promise', function() {
  var deferred;
  var fnStrToStr;
  var fnStrToNum;
  var promise;
  var branchedPromise;

  beforeEach(function() {
    deferred = new goog.async.Deferred();
    promise = /** @type {!jssip.async.Promise.<string>} */ (
        new jssip.async.Promise(deferred));

    /**
     * @param {string} str
     */
    fnStrToStr = function(str) {
      arguments.callee.was_called_with = arguments;
      return 'callback1'
    };

    /**
     * @param {string} str
     * @return {number}
     */
    fnStrToNum = function(str) {
      arguments.callee.was_called_with = arguments;
      return 0;
    };
  });

  describe('#then and #thenBranch', function() {
    it('registers callbacks with the deferred', function() {
      promise.then(fnStrToStr);
      branchedPromise = /** @type {!jssip.async.Promise.<number>} */ (
          promise.thenBranch(fnStrToNum));

      deferred.callback('a result');
      expect(fnStrToStr.was_called_with[0]).toBe('a result');
      expect(fnStrToNum.was_called_with[0]).toBe('callback1');
    });

    it('registers errbacks with the deferred that never change the ' +
       'return value', function() {
      promise.then(undefined, fnStrToStr);
      branchedPromise = /** @type {!jssip.async.Promise.<number>} */ (
          promise.thenBranch(undefined, fnStrToNum));

      deferred.errback('an error');
      expect(fnStrToStr.was_called_with[0]).toBe('an error');
      expect(fnStrToNum.was_called_with[0]).toBe('an error');
    });

    describe('#then', function() {
      it('returns the same promise instance', function() {
        expect(promise.then(fnStrToStr)).toBe(promise);
      });

      it('chains promises likes deferreds', function() {
        var deferredInner = new goog.async.Deferred();
        var promiseInner = new jssip.async.Promise(deferredInner);
        var promiseDidDeliver = false;
        promiseInner.then(function(str) {
          promiseDidDeliver = true;
          expect(str).toBe('triggers inner deferred');
          return 'now all done';
        });

        // Register a function that returns a promise
        promise.then(function(str) {
          expect(str).toBe('triggers outer deferred');
          return promiseInner;
        });

        var nextStr;
        promise.then(function() {
          nextStr = arguments[0];
        });

        deferred.callback('triggers outer deferred');
        expect(promiseDidDeliver).toBe(false);
        expect(nextStr).toBe(undefined);

        deferredInner.callback('triggers inner deferred');
        expect(promiseDidDeliver).toBe(true);
        expect(nextStr).toBe('now all done');
      });
    });

    describe('#thenBranch', function() {
      it('returns a new promise instance', function() {
        branchedPromise = /** @type {!jssip.async.Promise.<number>} */ (
            promise.thenBranch(fnStrToNum));
        expect(promise).not.toBe(branchedPromise);
        expect(branchedPromise).toEqual(jasmine.any(jssip.async.Promise));
      });

      it('branches the deferred', function() {
        promise.then(fnStrToStr);
        branchedPromise = /** @type {!jssip.async.Promise.<number>} */ (
            promise.thenBranch(fnStrToNum));

        var laterPromiseResult;
        promise.then(function(str) {
          laterPromiseResult = str;
        });
        deferred.callback('result');
        expect(laterPromiseResult).toBe('callback1');
      })
    });
  });

  describe('.succeed', function() {
    it('fires callbacks immediately', function() {
      var successPromise = /** @type {!jssip.async.Promise.<number>} */ (
          jssip.async.Promise.succeed(42));
      var spy1 = jasmine.createSpy();
      successPromise.then(spy1);
      expect(spy1).toHaveBeenCalledWith(42);

      var spy2 = jasmine.createSpy();
      successPromise.then(spy2);
      expect(spy2).toHaveBeenCalledWith(42);
    });
  });
});
