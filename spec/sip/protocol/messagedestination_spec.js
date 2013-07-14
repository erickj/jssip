goog.provide('jssip.sip.protocol.MessageDestinationSpec');

goog.require('goog.net.IpAddress');
goog.require('jssip.net.Socket');
goog.require('jssip.sip.protocol.MessageDestination');

describe('jssip.sip.protocol.MessageDestination', function() {
  var messageDestination;
  var ipAddress;
  var port;
  var socketType;

  beforeEach(function() {
    ipAddress = new goog.net.IpAddress.fromString('1.2.3.4');
    port = 5060;
    socketType = jssip.net.Socket.Type.TLS;

    messageDestination =
        new jssip.sip.protocol.MessageDestination(ipAddress, port, socketType);
  });

  describe('#getIpAddress', function() {
    it('should get the IP Address', function() {
      expect(messageDestination.getIpAddress()).toBe(ipAddress);
    });
  });

  describe('#getPort', function() {
    it('should get the port', function() {
      expect(messageDestination.getPort()).toBe(port);
    });
  });

  describe('#getSocketType', function() {
    it('should get the socket type', function() {
      expect(messageDestination.getSocketType()).toBe(socketType);
    });
  });

  describe('#equals', function() {
    it('should equal itself', function() {
      expect(messageDestination.equals(messageDestination)).toBe(true);
    });

    it('should equal like MessageDestinations', function() {
      var other = new jssip.sip.protocol.MessageDestination(
        new goog.net.IpAddress.fromString('1.2.3.4'), port, socketType);
      expect(messageDestination.equals(other)).toBe(true);
      expect(other.equals(messageDestination)).toBe(true);
    });

    it('should not equal non-MessageDestinations', function() {
      expect(messageDestination.equals({})).toBe(false);
    });

    it('should not equal unequal MessageDestinations', function() {
      var other = new jssip.sip.protocol.MessageDestination(
          ipAddress, 6060, socketType);
      expect(messageDestination.equals(other)).toBe(false);
      expect(other.equals(messageDestination)).toBe(false);
    })
  });
});
