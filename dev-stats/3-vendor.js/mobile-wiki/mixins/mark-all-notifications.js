define('mobile-wiki/mixins/mark-all-notifications', ['exports', 'mobile-wiki/utils/notifications-tracker'], function (exports, _notificationsTracker) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		actions: {
			markAllAsRead: function markAllAsRead() {
				(0, _notificationsTracker.trackMarkAllAsRead)();
				this.get('notifications').markAllAsRead();
			}
		}
	});
});