goog.provide('jssip.event.EventBus');

goog.require('goog.events.EventTarget');



/**
 * @param {!jssip.event.EventBus=} opt_parentEventBus An optional parent event
 *     bus.  If provided it will be set as this parent of this bus.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jssip.event.EventBus = function(opt_parentEventBus) {
  goog.base(this);

  if (opt_parentEventBus) {
    this.setParentEventTarget(opt_parentEventBus);
  }
};
goog.inherits(jssip.event.EventBus, goog.events.EventTarget);
