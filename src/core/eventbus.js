goog.provide('jssip.core.EventBus');

goog.require('goog.events.EventTarget');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jssip.core.EventBus = function() {
  goog.base(this);
};
goog.inherits(jssip.core.EventBus, goog.events.EventTarget);
