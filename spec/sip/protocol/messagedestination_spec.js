goog.provide('jssip.sip.protocol.MessageDestinationSpec');

goog.require('goog.net.IpAddress');
goog.require('jssip.net.Socket');
goog.require('jssip.sip.protocol.MessageDestination');

describe('jssip.sip.protocol.MessageDestination', function() {
  var lookupResult;
  var ipAddress;
  var port;
  var socketType;

  beforeEach(function() {
    ipAddress = new goog.net.IpAddress.fromString('1.2.3.4');
    port = 5060;
    socketType = jssip.net.Socket.Type.TLS;

    lookupResult = new jssip.sip.protocol.MessageDestination(ipAddress, port, socketType);
  });

  describe('getters', function() {
    describe('#getIpAddress', function() {
      it('should get the IP Address', function() {
        expect(lookupResult.getIpAddress()).toBe(ipAddress);
      });
    });

    describe('#getPort', function() {
      it('should get the port', function() {
        expect(lookupResult.getPort()).toBe(port);
      });
    });

    describe('#getSocketType', function() {
      it('should get the socket type', function() {
        expect(lookupResult.getSocketType()).toBe(socketType);
      });
    });
  });
});
