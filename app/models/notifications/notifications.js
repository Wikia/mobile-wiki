import Ember from 'ember';
import Notification from './notification';
import fetch from 'ember-network/fetch';
import {convertToIsoString} from '../../utils/iso-date-time';
import {getOnSiteNotificationsServiceUrl, getQueryString} from '../../utils/url';

const {Object: EmberObject, A, RSVP, Logger} = Ember;

const NotificationsModel = EmberObject.extend({
	unreadCount: 0,
	data: null,

	getNewestNotificationISODate() {
		return convertToIsoString(this.get('data.0.timestamp'));
	},

	getOldestNotificationISODate() {
		return convertToIsoString(this.get('data.lastObject.timestamp'));
	},

	setNormalizedData(apiData) {
		this.setProperties({
			data: new A()
		});

		const notifications = apiData.notifications;

		if (notifications && notifications.length) {
			this.addNotifications(notifications);
		}
	},

	loadMoreResults() {
		const queryString = getQueryString({
			startingTimestamp: this.getOldestNotificationISODate()
		});

		return fetch(getOnSiteNotificationsServiceUrl(`/notifications${queryString}`), {
			credentials: 'include'
		})
			.then((response) => response.json())
			.then((data) => {
				this.addNotifications(data.notifications);
				return data.notifications.length;
			});
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
	},

});

NotificationsModel.reopenClass({
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	getNotifications() {
		const model = NotificationsModel.create();

		return RSVP.all([
			this.getNotificationsList(model),
			this.getUnreadNotificationsCount(model)
		]).then(() => {
			return model;
		});
	},

	getUnreadNotificationsCount(model) {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications/unread-count'), {
			credentials: 'include'
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((result) => {
						model.set('unreadCount', result.unreadCount);
					});
				} else {
					model.set('unreadCount', 0);
					Logger.error('Notifications unread-count error:', response);
				}
			}).catch((error) => {
				model.set('unreadCount', 0);
				Logger.error('Setting notifications unread count to 0 because of the API fetch error');
			});
	},

	getNotificationsList(model) {
		return this.requestNotifications().then((data) => {
			model.setNormalizedData(data);
		});
	},

	/**
	 * @private
	 */
	requestNotifications() {
		return fetch(getOnSiteNotificationsServiceUrl('/notifications'), {
			credentials: 'include'
		}).then((response) => response.json());
	}

});

export default NotificationsModel;
