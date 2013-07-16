goog.provide('jssip.sip.event.TransportInfo');


/**
 * @param {boolean} wasSent
 * @param {!jssip.sip.protocol.ViaParm} viaParm
 * @constructor
 */
jssip.sip.event.TransportInfo = function(wasSent, viaParm) {
  /** @type {boolean} */
  this.wasSent = wasSent;

  /** @type {!jssip.sip.protocol.ViaParm} */
  this.viaParm = viaParm;
};
