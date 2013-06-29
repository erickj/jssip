goog.provide('jssip.sip.protocol.ViaParmSpec');

goog.require('jssip.sip.protocol.ParsedParams');
goog.require('jssip.sip.protocol.ViaParm');

describe('jssip.sip.protocol.ViaParm', function() {
  var protocol;
  var version;
  var transport;
  var host;
  var port;
  var parsedParams;
  var viaParm;

  var makeParsedParamArray = function(keyValuePairs) {
    var ret = [];
    for (var i = 0; i < keyValuePairs.length; i++) {
      var key = keyValuePairs[i][0];
      var val = keyValuePairs[i][1];
      ret.push([';', [key, '=', val]]);
    }
    return ret;
  };

  beforeEach(function() {
    protocol = 'SIP';
    version = '2.0';
    transport = 'UDP';
    host = 'magical.mystery.tour';
    port = '4242';

    var paramKeyValuePairs = [
      ['received', '1.2.3.4'],
      ['ttl', '10'],
      ['branch', 'limb'],
      ['maddr', '4.3.2.1']
    ];
    parsedParams = new jssip.sip.protocol.ParsedParams(
        makeParsedParamArray(paramKeyValuePairs));

    viaParm = new jssip.sip.protocol.ViaParm(
        protocol, version, transport, host, port, parsedParams);
  });

  describe('getters', function() {
    describe('#getTransport', function() {
      it('should be transport', function() {
        expect(viaParm.getTransport()).toBe('UDP');
      });
    });

    describe('#getHostPort', function() {
      it('should be the host port', function() {
        expect(viaParm.getHostPort()).toBe('magical.mystery.tour:4242');
      });

      it('should omit the port if not provided', function() {
        viaParm =  new jssip.sip.protocol.ViaParm(
            protocol, version, transport, host, '', parsedParams);
        expect(viaParm.getHostPort()).toBe('magical.mystery.tour');
      });
    });

    describe('#getParams', function() {
      it('should get the params', function() {
        expect(viaParm.getParams()).toBe(parsedParams);
      });
    });

    describe('#getTtl', function() {
      it('should get the ttl', function() {
        expect(viaParm.getTtl()).toBe('10');
      });
    });

    describe('#getReceived', function() {
      it('should get the received', function() {
        expect(viaParm.getReceived()).toBe('1.2.3.4');
      });
    });

    describe('#getMaddr', function() {
      it('should get the maddr', function() {
        expect(viaParm.getMaddr()).toBe('4.3.2.1');
      });
    });

    describe('#getBranch', function() {
      it('should get the branch', function() {
        expect(viaParm.getBranch()).toBe('limb');
      });
    });
  });

  describe('#equals', function() {
    it('should equal itself', function() {
      expect(viaParm.equals(viaParm)).toBe(true);
    });

    it('should equal an identical ViaParm', function() {
      var viaParm2 = new jssip.sip.protocol.ViaParm(
          protocol, version, transport, host, port, parsedParams);
      expect(viaParm.equals(viaParm2)).toBe(true);
      expect(viaParm2.equals(viaParm)).toBe(true);
    });

    it('should equal a ViaParm with different order params', function() {
      var paramKeyValuePairs2 = [
        ['maddr', '4.3.2.1'],
        ['branch', 'limb'],
        ['ttl', '10'],
        ['received', '1.2.3.4']
      ];
      var parsedParams2 = new jssip.sip.protocol.ParsedParams(
        makeParsedParamArray(paramKeyValuePairs2));
      var viaParm2 = new jssip.sip.protocol.ViaParm(
          protocol, version, transport, host, port, parsedParams2);
      expect(viaParm.equals(viaParm2)).toBe(true);
      expect(viaParm2.equals(viaParm)).toBe(true);
    });

    it('should not equal a different ViaParm', function() {
      var viaParm2 = new jssip.sip.protocol.ViaParm(
          protocol, version, 'TCP', host, port, parsedParams);
      expect(viaParm.equals(viaParm2)).toBe(false);
      expect(viaParm2.equals(viaParm)).toBe(false);
    });
  });
});
