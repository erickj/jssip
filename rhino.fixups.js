var rhino = {};

rhino.base = function(caller, me, opt_methodName, var_args) {
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 2))
  }
  var args = Array.prototype.slice.call(arguments, 3);
  var foundCaller = false;
  for(var ctor = me.constructor;
      ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " +
        "to a method of a different name");
  }
};
