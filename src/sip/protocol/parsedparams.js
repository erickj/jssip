goog.provide('jssip.sip.protocol.ParsedParams');

goog.require('goog.structs.Map');



/**
 * A class representing an set of SIP ';' delimited parameters.  The input
 * parameters are in the same format as those parsed by the PEG grammar.
 *
 * e.g. The parameter list ';name1=value1;name2' would be:
 * [[';', ['name1', '=', 'value1']], [';', [name2]]]
 *
 * @param {!Array.<!Array>} parsedParams
 * @constructor
 */
jssip.sip.protocol.ParsedParams = function(parsedParams) {
  /** @private {!Array.<!Array>} */
  this.parsedParams_ = parsedParams;

  /** @private {!goog.structs.Map} */
  this.paramMap_ = this.buildParamMap_();
};


/**
 * Gets the parameters as an object.
 * @return {!Object.<string|boolean>}
 */
jssip.sip.protocol.ParsedParams.prototype.getParametersAsObject = function() {
  return this.paramMap_.toObject();
};

/**
 * Gets a parameter value.
 * @param {string} name
 * @return {?(string|boolean)}, null if not present
 */
jssip.sip.protocol.ParsedParams.prototype.getParameter = function(name) {
  return /** @type {(string|boolean|null)} */ (this.paramMap_.get(name, null));
};


/**
 * Whether or not the parsed param map has a given parameter.  This method will
 * lazily populate the {@code paramLocMap_} as params are requested.
 * @param {string} name
 * @return {boolean}
 */
jssip.sip.protocol.ParsedParams.prototype.hasParameter = function(name) {
  return this.paramMap_.containsKey(name);
};


/**
 * @return {!goog.structs.Map}
 * @private
 */
jssip.sip.protocol.ParsedParams.prototype.buildParamMap_ = function() {
  var map = {};
  var nameIndex = 0;
  var valueIndex = 2;
  for (var i = 0; i < this.parsedParams_.length; i++) {
    var param = this.parsedParams_[i][1];
    var name = param[nameIndex];
    var value = goog.isDef(param[valueIndex]) ? param[valueIndex] : true;
    map[name] = value;
  }
  return new goog.structs.Map(map);
};


/**
 * Whether this is equal to another object.
 * @param {!Object} o
 * @return {boolean}
 */
jssip.sip.protocol.ParsedParams.prototype.equals = function(o) {
  return o === this || (o instanceof jssip.sip.protocol.ParsedParams &&
      /** @type {!jssip.sip.protocol.ParsedParams} */ (
          o).paramMap_.equals(this.paramMap_));
};


/** @return {string} */
jssip.sip.protocol.ParsedParams.prototype.stringify = function() {
  var str = '';
  var nameIndex = 0;
  var valueIndex = 2;
  for (var i = 0; i < this.parsedParams_.length; i++) {
    var param = this.parsedParams_[i][1];
    str += ';' + param[nameIndex];
    if (goog.isDef(param[valueIndex])) {
      str += '=' + param[valueIndex];
    }
  }
  return str;
};


/**
 * Creates a ParsedParams from a map of parameter values.
 * @param {!Object.<string|boolean>} parameterMap
 * @return {!jssip.sip.protocol.ParsedParams}
 */
jssip.sip.protocol.ParsedParams.createFromParameterMap =
    function(parameterMap) {
  var uglifiedParamList = [];
  for (var paramName in parameterMap) {
    var param = [paramName];
    if (goog.isString(parameterMap[param])) {
      param.push('=', parameterMap[param]);
    }
    uglifiedParamList.push([';', param]);
  };
  return new jssip.sip.protocol.ParsedParams(uglifiedParamList);
};
