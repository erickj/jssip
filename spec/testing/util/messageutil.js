goog.provide('jssip.testing.util.messageutil');

goog.require('jssip.event.EventBus');
goog.require('jssip.message.MessageParserFactory');
goog.require('jssip.message.RawMessageContext');
goog.require('jssip.parser.ParserRegistry');


/** @enum {string} */
jssip.testing.util.messageutil.ExampleMessage = {
  INVITE: ['INVITE sip:1234@foobar.com SIP/2.0',
           'Call-ID: 10c2565d1838d1b@1.2.3.4',
           'CSeq: 1 INVITE',
           'From: "Erick" <sip:erick@ejjohnson.org>;tag=fd0db81c',
           'To: <sip:1234@foobar.com>',
           'Via: SIP/2.0/UDP 10.0.1.12:5060;branch=z9hG4bK-393537-8a',
           'Max-Forwards: 70',
           'Contact: "Erick" <sip:erick@10.0.1.12:5060;transport=udp;registering_acc=ejjohnson_org>',
           'User-Agent: Jitsi2.2.4603.9615Linux',
           'Content-Type: application/sdp',
           'Content-Length: 326',
           '\r\n',
           'v=0',
           'o=erick 0 0 IN IP4 10.0.1.12',
           's=-',
           'c=IN IP4 10.0.1.12',
           't=0 0',
           'm=audio 5004 RTP/AVP 96 9 0 8 3 101',
           'a=rtpmap:96 opus/48000',
           'a=fmtp:96 usedtx=1',
           'a=rtpmap:9 G722/8000',
           'a=rtpmap:0 PCMU/8000',
           'a=rtpmap:8 PCMA/8000',
           'a=rtpmap:3 GSM/8000',
           'a=rtpmap:101 telephone-event/8000',
           'a=extmap:1 urn:ietf:params:rtp-hdrext:csrc-audio-level'].join('\r\n'),

  INVITE_200_OK: ['SIP/2.0 200 OK',
                  'Via: SIP/2.0/UDP 10.0.1.12:5060;rport=48926;received=73.95.61.232;branch=z9hG4bK-393537-8a',
                  'Record-Route: <sip:91.23.44.102;lr;ftag=fd0db81c;nc=1;did=01a.c7539b97>',
                  'From: "Erick" <sip:erick@ejjohnson.org>;tag=fd0db81c',
                  'To: <sip:1234@foobar.com>;tag=as44045c3d',
                  'Call-ID: 10c2565d1838d1b@1.2.3.4',
                  'CSeq: 1 INVITE',
                  'User-Agent: Asterisk PBX',
                  'Allow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY',
                  'Contact: <sip:foobar.com@91.23.44.102;gr>',
                  'Content-Type: application/sdp',
                  'Content-Length: 271',
                  '\r\n',
                  'v=0',
                  'o=root 4740 4740 IN IP4 92.34.22.12',
                  's=session',
                  'c=IN IP4 92.34.22.12',
                  't=0 0',
                  'm=audio 11662 RTP/AVP 0 8 3 101',
                  'a=rtpmap:0 PCMU/8000',
                  'a=rtpmap:8 PCMA/8000',
                  'a=rtpmap:3 GSM/8000',
                  'a=rtpmap:101 telephone-event/8000',
                  'a=fmtp:101 0-16',
                  'a=silenceSupp:off - - - -',
                  'a=ptime:20'].join('\r\n')
};


/**
 * Runs an expectation that the given header name-value pairs pass jasmine
 * {@code expect(header[name]).toEqual(value)} testing.  If the value is a
 * RegExp then {@code toMatch} will be used.
 * @param {!Object} nameValuePairs The expected name value pairs
 * @param {!jssip.message.Message} message The message to check against
 */
jssip.testing.util.messageutil.checkMessageHeaders =
    function(nameValuePairs, message) {
  for (var name in nameValuePairs) {
    var value = nameValuePairs[name];
    var method = (value instanceof RegExp) ? 'toMatch' : 'toEqual';
    if (!(value instanceof RegExp) && !goog.isArray(value)) {
      value = [value];
    }

    var expectation = expect(message.getHeaderValue(name));
    expectation[method].call(expectation, value);
  }
};


/**
 * Creates a raw message context with the given message text.
 * @param {string} rawMessageText
 * @return {!jssip.message.RawMessageText}
 */
jssip.testing.util.messageutil.createRawMessageContext =
    function(rawMessageText) {
  var eventBus = new jssip.event.EventBus();
  var messageParserFactory =
      new jssip.message.MessageParserFactory(eventBus);
  var parserRegistry = new jssip.parser.ParserRegistry(messageParserFactory);

  return new jssip.message.RawMessageContext(rawMessageText, parserRegistry);
};
