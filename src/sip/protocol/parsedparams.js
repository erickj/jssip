goog.provide('jssip.sip.protocol.ParsedParams');



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

  /** @private {!Object.<number>} */
  this.paramLocMap_ = {};

  /** @private {number} */
  this.lastInspectedIndex_ = -1;
};


/**
 * @const {number}
 * @private
 */
jssip.sip.protocol.ParsedParams.NOT_FOUND_ = -1;


/**
 * @enum {number}
 * @private
 */
jssip.sip.protocol.ParsedParams.Index_ = {
  NAME: 0,
  VALUE: 2
};


/**
 * Gets a parameter value.
 * @param {string} name
 * @return {(string|boolean|undefined)} or null if not found
 */
jssip.sip.protocol.ParsedParams.prototype.getParameter = function(name) {
  if (!this.hasParameter(name)) {
    return undefined;
  }
  return this.parsedParams_[this.paramLocMap_[name]][1][
      jssip.sip.protocol.ParsedParams.Index_.VALUE];
};


/**
 * Whether or not the parsed param map has a given parameter.  This method will
 * lazily populate the {@code paramLocMap_} as params are requested.
 * @param {string} name
 * @return {boolean}
 */
jssip.sip.protocol.ParsedParams.prototype.hasParameter = function(name) {
  if (!goog.isDef(this.paramLocMap_[name])) {
    this.paramLocMap_[name] = jssip.sip.protocol.ParsedParams.NOT_FOUND_;
    this.lastInspectedIndex_++;
    for (var i = this.lastInspectedIndex_; i < this.parsedParams_.length; i++) {
      var param = this.parsedParams_[i][1];
      this.paramLocMap_[param[jssip.sip.protocol.ParsedParams.Index_.NAME]] = i;
      if (!goog.isDef(param[jssip.sip.protocol.ParsedParams.Index_.VALUE])) {
        param[jssip.sip.protocol.ParsedParams.Index_.VALUE] = true;
      }
      if (param[jssip.sip.protocol.ParsedParams.Index_.NAME] == name) {
        break;
      }
    }
    this.lastInspectedIndex_ = i;
  }
  return this.paramLocMap_[name] > jssip.sip.protocol.ParsedParams.NOT_FOUND_;
};
