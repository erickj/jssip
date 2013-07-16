beforeEach(function() {
  this.addMatchers(/** @lends {jasmine.Matcher.prototype } */ ({
    toPromiseSuccess: function(callbackExpectation) {
      var callbackFired = false;
      var wrappedCallback = function() {
        callbackFired = true;
        callbackExpectation.apply(this, arguments);
      }
      expect(this.actual).toEqual(jasmine.any(jssip.async.Promise));
      this.actual.then(wrappedCallback);

      return callbackFired;
    },
    toPromiseError: function(errbackExpectation) {
      var callbackFired = false;
      var wrappedErrback = function() {
        callbackFired = true;
        errbackExpectation.apply(this, arguments);
      }
      expect(this.actual).toEqual(jasmine.any(jssip.async.Promise));
      this.actual.then(undefined, wrappedErrback);

      return callbackFired;
    }
  }));
});
