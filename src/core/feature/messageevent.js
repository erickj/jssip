goog.provide('jssip.core.feature.MessageEvent');

goog.require('goog.events.Event');



/**
 * A message event.
 * @param {!jssip.message.MessageContext} messageContext
 * @param {string} type
 * @param {Object=} opt_target {@see goog.events.Event}.
 * @constructor
 * @extends {goog.events.Event}
 */
jssip.core.feature.MessageEvent = function(messageContext, type, opt_target) {
  goog.base(this, type, opt_target);

  /** @type {!jssip.message.MessageContext} */
  this.messageContext = messageContext;
};
goog.inherits(jssip.core.feature.MessageEvent, goog.events.Event);
