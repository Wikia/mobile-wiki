define('mobile-wiki/components/wikia-user-profile', ['exports', 'mobile-wiki/mixins/no-scroll', 'mobile-wiki/mixins/notifications-scroll-menu', 'mobile-wiki/mixins/mark-all-notifications', 'mobile-wiki/utils/notifications-tracker'], function (exports, _noScroll, _notificationsScrollMenu, _markAllNotifications, _notificationsTracker) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var oneWay = Ember.computed.oneWay;
	var Component = Ember.Component;
	exports.default = Component.extend(_noScroll.default, _notificationsScrollMenu.default, _markAllNotifications.default, {
		classNames: ['wikia-user-profile'],
		currentUser: service(),
		notifications: service(),
		wikiVariables: service(),

		notificationsList: oneWay('notifications.model.data'),
		isLoadingNewResults: oneWay('notifications.isLoading'),
		username: oneWay('currentUser.name'),

		init: function init() {
			this._super.apply(this, arguments);
			this.errors = [];
			this.get('notifications').loadFirstPage();
		},
		didRender: function didRender() {
			this._super.apply(this, arguments);
			this.element.scrollTop = 0;
			(0, _notificationsTracker.trackOpenMenu)(this.get('notifications').getUnreadCount());
		},


		actions: {
			getBack: function getBack() {
				this.sendAction('setDrawerContent', 'nav');
			}
		}
	});
});