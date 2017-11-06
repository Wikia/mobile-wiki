define('mobile-wiki/mixins/notifications-unread-count', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var gt = Ember.computed.gt;
	var Mixin = Ember.Mixin;
	var computed = Ember.computed;
	exports.default = Mixin.create({
		unreadCount: computed('notifications.model.unreadCount', function () {
			var count = this.get('notifications.model.unreadCount');
			if (count > 99) {
				return '99+';
			} else {
				return count;
			}
		}),
		hasUnread: gt('notifications.model.unreadCount', 0)
	});
});