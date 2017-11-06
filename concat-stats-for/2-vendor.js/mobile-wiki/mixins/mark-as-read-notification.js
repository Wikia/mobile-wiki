define('mobile-wiki/mixins/mark-as-read-notification', ['exports', 'mobile-wiki/utils/notifications-tracker'], function (exports, _notificationsTracker) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		actions: {
			markAsRead: function markAsRead(notification) {
				(0, _notificationsTracker.trackMarkAsRead)(notification);
				this.get('notifications').markAsRead(notification);
			}
		}
	});
});