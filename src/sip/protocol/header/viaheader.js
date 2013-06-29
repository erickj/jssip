goog.provide('jssip.sip.protocol.header.ViaHeader');
goog.provide('jssip.sip.protocol.header.ViaHeaderParserFactory');

goog.require('jssip.message.HeaderDecorator');
goog.require('jssip.message.WrappingHeaderParserFactory');
goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.ViaParm');



/**
 * @param {!jssip.message.HeaderParserFactory} wrappedHeaderParserFactory
 * @param {string} headerName
 * @constructor
 * @extends {jssip.message.WrappingHeaderParserFactory}
 */
jssip.sip.protocol.header.ViaHeaderParserFactory =
    function(wrappedHeaderParserFactory, headerName) {
  goog.base(this, wrappedHeaderParserFactory, headerName);
};
goog.inherits(jssip.sip.protocol.header.ViaHeaderParserFactory,
    jssip.message.WrappingHeaderParserFactory);


/** @override */
jssip.sip.protocol.header.ViaHeaderParserFactory.prototype.
    createParserInternal = function(wrappedParser) {
  return new jssip.sip.protocol.header.ViaHeaderParser_(wrappedParser);
};



/**
 * @param {!jssip.message.HeaderParser} wrappedHeaderParser
 * @constructor
 * @extends {jssip.message.WrappingHeaderParser}
 * @private
 */
jssip.sip.protocol.header.ViaHeaderParser_ = function(wrappedHeaderParser) {
  goog.base(this, wrappedHeaderParser);
};
goog.inherits(jssip.sip.protocol.header.ViaHeaderParser_,
    jssip.message.WrappingHeaderParser);


/** @override */
jssip.sip.protocol.header.ViaHeaderParser_.prototype.parseInternal =
    function(header) {
  var parsedVia = header.getParsedValue();
  var viaParm = jssip.sip.protocol.header.ViaHeaderParser_.
      deserializeToViaParm_(parsedVia[0]);

  var addlViaParms = [];
  for (var i = 0; i < parsedVia[1].length; i++) {
    addlViaParms.push(jssip.sip.protocol.header.ViaHeaderParser_.
        deserializeToViaParm_(parsedVia[1][i]));
  }

  return new jssip.sip.protocol.header.ViaHeader(header, viaParm, addlViaParms);
};


/**
 * Converts a parsed via parm into a ViaParm.
 * {@code jssip.sip.protocol.Via}.
 * @param {!Array} parsedViaParm
 * @return {!jssip.sip.protocol.ViaParm}
 */
jssip.sip.protocol.header.ViaHeaderParser_.deserializeToViaParm_ =
    function(parsedViaParm) {
  goog.asserts.assert(goog.isArray(parsedViaParm));

  var sentProtocol = parsedViaParm[0];
  var protocol = sentProtocol[0];
  var version = sentProtocol[2];
  var transport = sentProtocol[4];

  var sentBy = parsedViaParm[2];
  var host = sentBy[0];
  var port = sentBy[1][1] || '';

  var params = new jssip.sip.protocol.ParsedParams(parsedViaParm[3]);

  return new jssip.sip.protocol.ViaParm(
      protocol, version, transport, host, port, params);
};



/**
 * A header value with a ViaParm and potentially additional ViaParms.
 * @param {!jssip.message.Header} decoratedHeader The header being decorated.
 * @param {!jssip.sip.protocol.ViaParm} viaParm The first ViaParm in the header.
 * @param {!Array.<!jssip.sip.protocol.ViaParm>} addlViaParms An array of other
 *     ViaParms in the Via header
 * @extends {jssip.message.HeaderDecorator}
 * @constructor
 */
jssip.sip.protocol.header.ViaHeader =
    function(decoratedHeader, viaParm, addlViaParms) {
  goog.base(this, decoratedHeader);

  /** @private {!jssip.sip.protocol.ViaParm} */
  this.viaParm_ = viaParm;

  /** @private {!Array.<!jssip.sip.protocol.ViaParm>} */
  this.addlViaParms_ = addlViaParms;
};
goog.inherits(
    jssip.sip.protocol.header.ViaHeader, jssip.message.HeaderDecorator);


/** @return {!jssip.sip.protocol.ViaParm} */
jssip.sip.protocol.header.ViaHeader.prototype.getViaParm = function() {
  return this.viaParm_;
};


/** @return {!Array.<!jssip.sip.protocol.ViaParm>} */
jssip.sip.protocol.header.ViaHeader.prototype.getAddlViaParms = function() {
  return this.addlViaParms_;
};
