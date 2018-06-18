import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { reject } from 'rsvp';
import EmberObject, { get } from '@ember/object';
import { getOwner } from '@ember/application';
import Notification from './notification';
import fetch from 'fetch';
import { convertToIsoString } from '../../utils/iso-date-time';
import { getOnSiteNotificationsServiceUrl } from '../../utils/url';

export default EmberObject.extend({
	unreadCount: 0,
	data: null,
	logger: service(),

	init() {
		this.data = new A();
	},

	getNewestNotificationISODate() {
		return convertToIsoString(this.get('data.0.timestamp'));
	},

	/**
	 * @return {Promise}
	 */
	loadUnreadNotificationCount() {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications/unread-count'), { credentials: 'include' })
			.then((response) => response.json())
			.then((result) => {
				this.set('unreadCount', result.unreadCount);
			}).catch((error) => {
				this.set('unreadCount', 0);
				this.logger.error('Setting notifications unread count to 0 because of the API fetch error');
			});
	},

	/**
	 * @return {Promise.<string>}
	 */
	loadFirstPageReturningNextPageLink() {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications'), { credentials: 'include' })
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
			return reject();
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
			body: JSON.stringify({ since }),
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(() => {
				this.data.setEach('isUnread', false);
				this.set('unreadCount', 0);
			});
	},

	addNotifications(notifications) {
		const notificationModels = notifications.map((notificationApiData) => {
			return Notification.create(getOwner(this).ownerInjection(), notificationApiData);
		});

		this.data.pushObjects(notificationModels);
	}
});
