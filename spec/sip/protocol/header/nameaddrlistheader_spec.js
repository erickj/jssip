goog.provide('jssip.sip.protocol.header.NameAddrListHeaderSpec');

goog.require('jssip.message.HeaderImpl');
goog.require('jssip.sip.protocol.header.NameAddrListHeader');
goog.require('jssip.testing.shared.SharedHeaderDecoratorSpec');

describe('jssip.sip.protocol.header.NameAddrListHeader', function() {
  var header;
  var nameAddrs;
  var nameAddrListHeader;
  var headerName = 'x-name';
  var headerRawValue = 'x-raw-val';
  var headerParsedValue = ['some', 'parsed', 'value'];

  var factoryFn = function() {
    header = new jssip.message.HeaderImpl(
        headerName, headerRawValue, headerParsedValue);
    nameAddrs = /** @type {!Array.<!jssip.sip.protocol.NameAddr>} */ ([]);
    nameAddrListHeader =
        new jssip.sip.protocol.header.NameAddrListHeader(header, nameAddrs);
    return nameAddrListHeader;
  };

  beforeEach(factoryFn);

  describe('NameAddrListHeader getters', function() {
    describe('#getNameAddrList', function() {
      it('should get the list of name-addrs', function() {
        expect(nameAddrListHeader.getNameAddrList()).toBe(nameAddrs);
      });
    });
  });

  jssip.testing.shared.SharedHeaderDecoratorSpec.sharedBehaviors(factoryFn,
      headerName, headerRawValue, headerParsedValue);
});
