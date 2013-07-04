goog.provide('jssip.sip.protocol.feature');

goog.require('jssip.sip.protocol.feature.DialogLayer');
goog.require('jssip.sip.protocol.feature.TransactionLayer');
goog.require('jssip.sip.protocol.feature.TransportLayer');
goog.require('jssip.sip.protocol.feature.UserAgentClient');
goog.require('jssip.sip.protocol.feature.UserAgentServer');


/** @enum {string} */
jssip.sip.protocol.feature.CoreType = {
  DIALOGLAYER: jssip.sip.protocol.feature.DialogLayer.TYPE,
  TRANSACTIONLAYER: jssip.sip.protocol.feature.TransactionLayer.TYPE,
  TRANSPORTLAYER: jssip.sip.protocol.feature.TransportLayer.TYPE,
  USERAGENTCLIENT: jssip.sip.protocol.feature.UserAgentClient.TYPE,
  USERAGENTSERVER: jssip.sip.protocol.feature.UserAgentServer.TYPE
};
