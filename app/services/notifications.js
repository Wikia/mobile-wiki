import { not } from '@ember/object/computed';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { reject } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import NotificationsModel from '../models/notifications/notifications';

export default Service.extend({
	model: null,
	isLoading: false,
	nextPage: null,

	currentUser: service(),
	fastboot: service(),
	logger: service(),
	wikiVariables: service(),

	/**
	 * @private
	 */
	isUserAnonymous: not('currentUser.isAuthenticated'),

	modelLoader: computed('isUserAnonymous', function () {
		if (this.get('fastboot.isFastBoot')) {
			return undefined;
		}
		if (this.isUserAnonymous === true) {
			return reject();
		}
		return this.model.loadUnreadNotificationCount()
			.catch((err) => {
				this.logger.warn('Couldn\'t load notification count', err);
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
		// eslint-disable-next-line
		this.modelLoader;
	},

	loadFirstPage() {
		if (this.isUserAnonymous === true
			|| this.isLoading === true
			|| this.nextPage !== null) {
			return;
		}
		this.set('isLoading', true);
		this.model
			.loadFirstPageReturningNextPageLink()
			.then((nextPage) => {
				this.set('nextPage', nextPage);
			})
			.catch((err) => {
				this.logger.warn('Couldn\'t load first page', err);
			})
			.finally(() => {
				this.set('isLoading', false);
			});
	},

	loadNextPage() {
		if (this.isUserAnonymous === true
			|| this.isLoading === true
			|| this.nextPage === null) {
			return;
		}
		this.set('isLoading', true);
		this.model
			.loadPageReturningNextPageLink(this.nextPage)
			.then((nextPage) => {
				this.set('nextPage', nextPage);
			})
			.catch((err) => {
				this.logger.warn('Couldn\'t load more notifications', err);
			})
			.finally(() => {
				this.set('isLoading', false);
			});
	},

	markAllAsRead() {
		this.model.markAllAsRead();
	},

	markAsRead(notification) {
		this.model.markAsRead(notification);
	},

	getUnreadCount() {
		return this.get('model.unreadCount');
	},

});
