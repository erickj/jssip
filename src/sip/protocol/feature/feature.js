goog.provide('jssip.sip.protocol.feature');

goog.require('jssip.sip.protocol.feature.TransportLayer');
goog.require('jssip.sip.protocol.feature.UserAgentClient');
goog.require('jssip.sip.protocol.feature.UserAgentServer');


/** @enum {string} */
jssip.sip.protocol.feature.CoreType = {
  TRANSPORTLAYER: jssip.sip.protocol.feature.TransportLayer.TYPE,
  USERAGENTCLIENT: jssip.sip.protocol.feature.UserAgentClient.TYPE,
  USERAGENTSERVER: jssip.sip.protocol.feature.UserAgentServer.TYPE
};
