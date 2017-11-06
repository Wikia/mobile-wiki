define('mobile-wiki/models/notifications/notifications', ['exports', 'mobile-wiki/models/notifications/notification', 'fetch', 'mobile-wiki/utils/iso-date-time', 'mobile-wiki/utils/url'], function (exports, _notification, _fetch, _isoDateTime, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var A = Ember.A;
	var reject = Ember.RSVP.reject;
	var EmberObject = Ember.Object;
	var get = Ember.get;
	var getOwner = Ember.getOwner;


	var NotificationsModel = EmberObject.extend({
		unreadCount: 0,
		data: new A(),
		logger: service(),

		getNewestNotificationISODate: function getNewestNotificationISODate() {
			return (0, _isoDateTime.convertToIsoString)(this.get('data.0.timestamp'));
		},
		loadUnreadNotificationCount: function loadUnreadNotificationCount() {
			var _this = this;

			return (0, _fetch.default)((0, _url.getOnSiteNotificationsServiceUrl)('/notifications/unread-count'), { credentials: 'include' }).then(function (response) {
				return response.json();
			}).then(function (result) {
				_this.set('unreadCount', result.unreadCount);
			}).catch(function (error) {
				_this.set('unreadCount', 0);
				_this.get('logger').error('Setting notifications unread count to 0 because of the API fetch error');
			});
		},
		loadFirstPageReturningNextPageLink: function loadFirstPageReturningNextPageLink() {
			var _this2 = this;

			return (0, _fetch.default)((0, _url.getOnSiteNotificationsServiceUrl)('/notifications'), { credentials: 'include' }).then(function (response) {
				return response.json();
			}).then(function (data) {
				_this2.addNotifications(data.notifications);
				return _this2.getNext(data);
			});
		},
		loadPageReturningNextPageLink: function loadPageReturningNextPageLink(page) {
			var _this3 = this;

			return (0, _fetch.default)((0, _url.getOnSiteNotificationsServiceUrl)(page), {
				method: 'GET',
				credentials: 'include'
			}).then(function (response) {
				return response.json();
			}).then(function (data) {
				_this3.addNotifications(data.notifications);
				return _this3.getNext(data);
			});
		},
		getNext: function getNext(data) {
			return get(data, '_links.next') || null;
		},
		markAsRead: function markAsRead(notification) {
			var _this4 = this;

			if (!notification.isUnread) {
				return reject();
			}

			return notification.markAsRead().then(function () {
				_this4.decrementProperty('unreadCount');
			});
		},
		markAllAsRead: function markAllAsRead() {
			var _this5 = this;

			var since = this.getNewestNotificationISODate();

			return (0, _fetch.default)((0, _url.getOnSiteNotificationsServiceUrl)('/notifications/mark-all-as-read'), {
				method: 'POST',
				body: JSON.stringify({ since: since }),
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			}).then(function () {
				_this5.get('data').setEach('isUnread', false);
				_this5.set('unreadCount', 0);
			});
		},
		addNotifications: function addNotifications(notifications) {
			var _this6 = this;

			var notificationModels = notifications.map(function (notificationApiData) {
				return _notification.default.create(getOwner(_this6).ownerInjection(), notificationApiData);
			});

			this.get('data').pushObjects(notificationModels);
		}
	});

	exports.default = NotificationsModel;
});