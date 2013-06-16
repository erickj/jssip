goog.provide('jssip.sip.protocol.header.NameAddrHeaderSpec');

goog.require('jssip.message.HeaderImpl');
goog.require('jssip.sip.protocol.NameAddr');
goog.require('jssip.sip.protocol.header.NameAddrHeader');
goog.require('jssip.testing.shared.SharedHeaderDecoratorSpec');

describe('jssip.sip.protocol.header.NameAddrHeader', function() {
  var header;
  var nameAddr;
  var nameAddrHeader;
  var headerName = 'x-name';
  var headerRawValue = 'x-raw-val';
  var headerParsedValue = ['some', 'parsed', 'value'];

  var factoryFn = function() {
    header = new jssip.message.HeaderImpl(
        headerName, headerRawValue, headerParsedValue);
    nameAddr = /** @type {!jssip.sip.protocol.NameAddr} */ ({});
    nameAddrHeader =
        new jssip.sip.protocol.header.NameAddrHeader(header, nameAddr);
    return nameAddrHeader;
  };

  beforeEach(factoryFn);

  describe('NameAddrHeader getters', function() {
    describe('#getNameAddr', function() {
      it('should get the name-addr', function() {
        expect(nameAddrHeader.getNameAddr()).toBe(nameAddr);
      });
    });
  });

  jssip.testing.shared.SharedHeaderDecoratorSpec.sharedBehaviors(factoryFn,
      headerName, headerRawValue, headerParsedValue);
});
