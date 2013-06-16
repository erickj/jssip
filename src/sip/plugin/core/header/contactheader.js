goog.provide('jssip.plugin.core.header.ContactHeader');

goog.require('jssip.sip.protocol.NameAddr');
//goog.require('jssip.sip.protocol.header.NameAddrListHeader');



/**
 * Converts parsed contact headers from their parsed PEG format into NameAddr
 * objects.
 * @param {!jssip.message.Header} contactHeader
 * @constructor
 * @extends {jssip.sip.protocol.header.NameAddrListHeader}
 */
jssip.plugin.core.header.ContactHeader = function(contactHeader) {
  var nameAddrs = jssip.plugin.core.header.ContactHeader.
      convertParsedValueToNameAddrs_(contactHeader.getParsedValue());
  goog.base(this, contactHeader, nameAddrs);
};
goog.inherits(jssip.plugin.core.header.ContactHeader,
    jssip.sip.protocol.header.NameAddrListHeader)


/**
 * Converts a parsed contact header from parsed PEG format to an array of
 * name-addrs.
 * @param {!Array} parsedContactValue
 * @return {!Array.<!jssip.sip.protocol.NameAddr>}
 * @private
 */
jssip.plugin.core.header.ContactHeader.convertParsedValueToNameAddrs_ =
    function(parsedContactValue) {
  var nameAddrs = [];
  for (var i = 0; i < parsedContactValue.length; i++) {
    var rawNameAddrOrAddrSpec = parsedContactValue[i][0];
    var rawParams =  parsedContactValue[i][1];

    var nameAddr = jssip.plugin.core.header.CoverterUtil.convertToNameAddr(
        rawNameAddrOrAddrSpec);
    var contactParams = jssip.plugin.core.header.ConverterUtil.convertToParams(
        rawParams);
  }
};
