goog.provide('jssip.core.EventBus');

goog.require('goog.events.EventTarget');



/**
 * @param {!jssip.core.EventBus=} opt_parentEventBus An optional parent event
 *     bus.  If provided it will be set as this parent of this bus.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
jssip.core.EventBus = function(opt_parentEventBus) {
  goog.base(this);

  if (opt_parentEventBus) {
    this.setParentEventTarget(opt_parentEventBus);
  }
};
goog.inherits(jssip.core.EventBus, goog.events.EventTarget);
