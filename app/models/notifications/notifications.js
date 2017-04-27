import Ember from 'ember';
import Notification from './notification';
import fetch from 'ember-network/fetch';
import {convertToIsoString} from '../../utils/iso-date-time';
import {getOnSiteNotificationsServiceUrl} from '../../utils/url';

const {A, inject, Object: EmberObject, RSVP, get} = Ember;

const NotificationsModel = EmberObject.extend({
	unreadCount: 0,
	data: new A(),
	logger: inject.service(),

	getNewestNotificationISODate() {
		return convertToIsoString(this.get('data.0.timestamp'));
	},

	/**
	 * @return {Promise}
	 */
	loadUnreadNotificationCount() {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications/unread-count'), {credentials: 'include'})
			.then((response) => response.json())
			.then((result) => {
				this.set('unreadCount', result.unreadCount);
			}).catch((error) => {
				this.set('unreadCount', 0);
				this.get('logger').error('Setting notifications unread count to 0 because of the API fetch error');
			});
	},

	/**
	 * @return {Promise.<string>}
	 */
	loadFirstPageReturningNextPageLink() {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications'), {credentials: 'include'})
			.then((response) => response.json())
			.then((data) => {
				this.addNotifications(data.notifications);
				return this.getNext(data);
			});
	},

	/**
	 * @param page link to the page to load
	 * @return {Promise.<string>}
	 */
	loadPageReturningNextPageLink(page) {
		return fetch(getOnSiteNotificationsServiceUrl(page), {
			method: 'GET',
			credentials: 'include'
		}).then((response) => response.json())
			.then((data) => {
				this.addNotifications(data.notifications);
				return this.getNext(data);
			});
	},

	getNext(data) {
		return get(data, '_links.next') || null;
	},

	markAsRead(notification) {
		if (!notification.isUnread) {
			return RSVP.reject();
		}

		return notification.markAsRead()
			.then(() => {
				this.decrementProperty('unreadCount');
			});
	},

	markAllAsRead() {
		const since = this.getNewestNotificationISODate();

		return fetch(getOnSiteNotificationsServiceUrl(`/notifications/mark-all-as-read`), {
			method: 'POST',
			body: JSON.stringify({since}),
			credentials: 'include',
			headers: {'Content-Type': 'application/json'},
		})
			.then(() => {
				this.get('data').setEach('isUnread', false);
				this.set('unreadCount', 0);
			});
	},

	addNotifications(notifications) {
		const notificationModels = notifications.map((notificationApiData) => {
			return Notification.create(notificationApiData);
		});

		this.get('data').pushObjects(notificationModels);
	}
});

export default NotificationsModel;
