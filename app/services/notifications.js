import Ember from 'ember';
import NotificationsModel from '../models/notifications/notifications';

const {
	computed,
	getOwner,
	inject,
	RSVP,
	Service
} = Ember;

export default Service.extend({
	model: null,
	isLoading: false,
	nextPage: null,

	currentUser: inject.service(),
	fastboot: inject.service(),
	logger: inject.service(),
	wikiVariables: inject.service(),

	/**
	 * @private
	 */
	isUserAnonymous: computed.not('currentUser.isAuthenticated'),

	modelLoader: computed('isUserAnonymous', function () {
		if (this.get('fastboot.isFastBoot')) {
			return;
		}
		if (this.get('isUserAnonymous') === true) {
			return RSVP.reject();
		}
		return this.get('model').loadUnreadNotificationCount()
			.catch((err) => {
				this.get('logger').warn('Couldn\'t load notification count', err);
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
		this.set('model', NotificationsModel.create(getOwner(this).ownerInjection()));
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
				this.get('logger').warn('Couldn\'t load first page', err);
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
				this.get('logger').warn('Couldn\'t load more notifications', err);
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

	getUnreadCount() {
		return this.get('model.unreadCount');
	}

});
