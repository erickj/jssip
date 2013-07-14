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
 * NOTE: Under current behavior of the @template type, it is legal to call this
 * method with callBack({foo}) and errBack({bar}) and T becomes {foo|bar}.  This
 * is almost definitely NOT what you want.
 *
 * Adds callbacks and errbacks to this promise's deferred that will. Any errback
 * will be wrapped so that it can not change the deferred return type on error.
 * not alter the result type.
 * @param {function(T):(T|undefined)=} opt_callBack
 * @param {function(*):(Error|undefined)=} opt_errBack
 * @template T
 * @return {!jssip.async.Promise.<T>} This promise
 */
jssip.async.Promise.prototype.then = function(opt_callBack, opt_errBack) {
  var errBack = opt_errBack ?
    function() { opt_errBack.apply(goog.global, arguments); } : null;
  this.deferred_.addCallbacks(opt_callBack || null, errBack);
  return this;
};


/**
 * NOTE: Under current behavior of the @template type, it is legal to call this
 * method with callBack({foo}) and errBack({bar}) and T becomes {foo|bar}.  This
 * is almost definitely NOT what you want.
 *
 * Creaet a new promise with result type R and branch the deferred.  Any
 * callbacks added to this promise will continue to return type T, any callbacks
 * added to the new promise will return type R. Any errback will be wrapped so
 * that it can not change the deferred return type on error.
 * @param {function(T):R=} opt_callBack
 * @param {function(*):(Error|undefined)=} opt_errBack
 * @template T,R
 * @return {!jssip.async.Promise.<R>} A new promise type.
 */
jssip.async.Promise.prototype.thenBranch = function(opt_callBack, opt_errBack) {
  var errBack = opt_errBack ?
    function() { opt_errBack.apply(goog.global, arguments); } : null;
  var branchedDeferred = this.deferred_.branch();
  branchedDeferred.addCallbacks(opt_callBack || null, errBack);
  // Casting the return value here using the templated {R} type
  // results in a "Bad type annotation" compiler error.  The callers
  // will always need to cast the promise explicitly.
  return new jssip.async.Promise(branchedDeferred);
};


/**
 * Create a promise that always succeeds
 * @param {T} value
 * @template T
 * @return {!jssip.async.Promise.<T>}
 */
jssip.async.Promise.succeed = function(value) {
  return new jssip.async.Promise(goog.async.Deferred.succeed(value));
}
