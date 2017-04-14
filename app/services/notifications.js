import Ember from 'ember';
import NotificationsModel from '../models/notifications/notifications';

const {Service, Logger, computed, inject, RSVP} = Ember;

export default Service.extend({
	model: NotificationsModel.create(),
	isLoading: false,
	nextPage: null,

	currentUser: inject.service(),
	wikiVariables: inject.service(),
	fastboot: inject.service(),

	/**
	 * @private
	 */
	isUserAnonymous: Ember.computed.not('currentUser.isAuthenticated'),

	modelLoader: computed('isUserAuthenticated', function () {
		if (this.get('fastboot.isFastBoot')) {
			return;
		}
		if (this.get('isUserAnonymous') === true) {
			return RSVP.reject();
		}
		return this.get('model').loadUnreadNotificationCount()
			.catch((err) => {
				Logger.warn('Couldn\'t load notification count', err);
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

	loadFirstPage() {
		if (this.get('isUserAnonymous') === true
			|| this.get('isLoading') === true
			|| this.get('nextPage') !== null) {
			return;
		}
		this.set('isLoading', true);
		this.get('model')
			.loadFirstPageReturningNextPageLink()
			.then((nextPage) => {
				this.set('nextPage', nextPage);
			})
			.catch((err) => {
				Logger.warn('Couldn\'t load first page', err);
			})
			.finally(() => {
				this.set('isLoading', false);
			});
	},

	loadNextPage() {
		if (this.get('isUserAnonymous') === true
			|| this.get('isLoading') === true
			|| this.get('nextPage') === null) {
			return;
		}
		this.set('isLoading', true);
		this.get('model')
			.loadPageReturningNextPageLink(this.get('nextPage'))
			.then((nextPage) => {
				this.set('nextPage', nextPage);
			})
			.catch((err) => {
				Logger.warn('Couldn\'t load more notifications', err);
			})
			.finally(() => {
				this.set('isLoading', false);
			});
	},

	markAllAsRead() {
		this.get('model').markAllAsRead();
	},

	markAsRead(notification) {
		this.get('model').markAsRead(notification);
	},


});
