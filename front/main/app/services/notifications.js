import Ember from 'ember';
import NotificationsModel from '../models/notifications/notifications';

const {Service, Logger, computed, inject, RSVP} = Ember;

export default Service.extend({
	isLoading: false,
	allLoaded: false,
	model: null,
	notificationsPerPage: 10,

	currentUser: inject.service(),

	/**
	 * @private
	 */
	isUserAuthenticated: Ember.computed.bool('currentUser.isAuthenticated'),

	/**
	 * @private
	 */
	enableOnSiteNotifications: Ember.get(Mercury, 'wiki.enableOnSiteNotifications'),


	modelLoader: computed('currentUser.isAuthenticated', 'enableOnSiteNotifications', function () {
		this.set('isLoading', true);
		if (!this.isUserAuthenticated || !this.enableOnSiteNotifications) {
			this.set('isLoading', false);
			return RSVP.reject();
		}

		return NotificationsModel.getNotifications()
			.then((model) => {
				this.setProperties({
					model,
					isLoading: false,
					allLoaded: model.data.length < this.get('notificationsPerPage')
				});
			})
			.catch((err) => {
				Logger.warn('Couldn\'t load notifications', err);
				this.set('isLoading', false);
			});
	}),

	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		// fetches the model from the API at first attempt to use the data
		// then a singleton service will keep the data until page reloads
		this.get('modelLoader');
	},

	loadMoreResults() {
		if (this.get('isLoading') === true || !this.isUserAuthenticated
			|| this.get('allLoaded') === true || !this.enableOnSiteNotifications) {
			return;
		}

		this.set('isLoading', true);
		this.get('model')
			.loadMoreResults(this.get('notificationsPerPage'))
			.then((resultCount) => {
				this.setProperties({
					isLoading: false,
					allLoaded: resultCount < this.get('notificationsPerPage')
				});
			})
			.catch((err) => {
				Logger.warn('Couldn\'t load more notifications', err);
				this.set('isLoading', false);
			});
	},

	markAllAsRead() {
		this.get('model').markAllAsRead();
	},

	markAsRead(notification) {
		this.get('model').markAsRead(notification);
	}

});
