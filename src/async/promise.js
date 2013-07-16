goog.provide('jssip.async.Promise');

goog.require('goog.async.Deferred');


/**
 * @fileoverview
 * A handcuff wrapper around goog.async.Deferred.  Provides ability to
 * statically type check callback and errabck handlers (as long as the Promise
 * is typed properly) and wraps errbacks in functions so that the errback return
 * values can not go on to call the success callback handlers after an error.
 *
 * A class to type check the result types of goog.async.Deferred objects.  Use
 * this to type check the callback and errback parameter and return types added
 * to a deferred.  It doesn't currenlty support type checking the
 * {@code callback} or {@code errback} values.  A useful example is detailed in
 * this code snippet:
 */

// // Init a new deferred
// var g = new goog.async.Deferred();
//
// // Create a promise that expects <string> results
// var pStr = /** @type {!jssip.async.Promise.<string>} */ (
//   new jssip.async.Promise(g));
//
// // Only fn's that accept & return <string> can be added with #then
// /**
//  * @param {string} val
//  * @return {string}
//  */
// var fnStr = function(val) { return val; };
// pStr.then(fnStr);
//
// // To change the promise to a <number> type, use #thenAlter
// /**
//  * @param {string} str
//  * @return {number}
//  */
// var fnStrToNum = function(str) { return 0; }
//
// // Must type cast to the expected Promise template type
// var pNum = /** @type {!jssip.async.Promise.<number>} */ (
//   pStr.thenAlter(fnStrToNum));
//
// // This will produce an error in the compiler
// pNum.then(fnStr);



/**
 * @param {!goog.async.Deferred} deferred
 * @template T
 * @constructor
 */
jssip.async.Promise = function(deferred) {
  /** @private {!goog.async.Deferred} */
  this.deferred_ = deferred;
};


/**
 * Adds callbacks and errbacks to this promise's deferred that will. Any errback
 * will be wrapped so that it can not change the deferred return type on error.
 * not alter the result type.  Callbacks are allowed to return a promise with a
 * matching type signature to this promise.  The callback will be wrapped so
 * that if a promise is returned, its deferred is returned resulting in a
 * chained deferred.
 *
 * NOTE: I believe the param signature of opt_callBack confuses the compiler,
 * for example see the hackery in
 * jssip.sip.plugin.core.UserAgentFeature#handleSendRequestResult_
 *
 * @param {function(T):(T|jssip.async.Promise.<T>|undefined)=} opt_callBack
 * @param {function(*):(Error|undefined)=} opt_errBack
 * @template T
 * @return {!jssip.async.Promise.<T>}
 */
jssip.async.Promise.prototype.then = function(opt_callBack, opt_errBack) {
  this.addCallbacks_(opt_callBack, opt_errBack);
  return this;
};


/**
 * NOTE: Under current behavior of the @template type, it is legal to call this
 * method with callBack({foo}) and errBack({bar}) and T becomes {foo|bar}.  This
 * is almost definitely NOT what you want.
 *
 * Create a new promise with result type R and branch the deferred.  Any
 * callbacks added to this promise will continue to return type T, any callbacks
 * added to the new promise will return type R. Any errback will be wrapped so
 * that it can not change the deferred return type on error. Callbacks are
 * allowed to return a promise with a matching type signature to this promise.
 * The callback will be wrapped so that if a promise is returned, its deferred
 * is returned resulting in a chained deferred.
 * @param {function(T):R=} opt_callBack
 * @param {function(*):(Error|undefined)=} opt_errBack
 * @template T,R
 * @return {!jssip.async.Promise.<R>} A new promise type.
 */
jssip.async.Promise.prototype.thenBranch = function(opt_callBack, opt_errBack) {
  var branchedDeferred = this.deferred_.branch();
  this.addCallbacks_(opt_callBack, opt_errBack, branchedDeferred);
  // Casting the return value here using the templated {R} type
  // results in a "Bad type annotation" compiler error.  The callers
  // will always need to cast the promise explicitly.
  return new jssip.async.Promise(branchedDeferred);
};


/**
 * Adds the callback and errback to this deferred.  Any callbacks may return a
 * jssip.async.Promise which will chain this Promise's deferred on the new
 * Promise's deferred.  All errbacks are wrapped so that they may not change the
 * deferred result type.
 * @param {!Function=} opt_callback
 * @param {!Function=} opt_errback
 * @param {!goog.async.Deferred=} opt_deferred
 * @private
 */
jssip.async.Promise.prototype.addCallbacks_ =
    function(opt_callback, opt_errback, opt_deferred) {
  var callback = opt_callback ?
      function() {
        var res = opt_callback.apply(goog.global, arguments);
        if (res instanceof jssip.async.Promise) {
          // Chains this.deferred_ on res.deferred_ and we know from the
          // compiler that res.deferred_ also completes with a T type.
          return res.deferred_;
        }
        return res;
      } :
      null;

  var errback = opt_errback ?
      function() { opt_errback.apply(goog.global, arguments); } : null;

  var deferred = opt_deferred || this.deferred_;
  deferred.addCallbacks(callback, errback);
};

/**
 * Create a promise that always succeeds
 * @param {T} value
 * @template T
 * @return {!jssip.async.Promise.<T>}
 */
jssip.async.Promise.succeed = function(value) {
  return new jssip.async.Promise(goog.async.Deferred.succeed(value));
};
