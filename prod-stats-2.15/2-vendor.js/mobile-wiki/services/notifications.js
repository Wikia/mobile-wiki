define('mobile-wiki/services/notifications', ['exports', 'mobile-wiki/models/notifications/notifications'], function (exports, _notifications) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var computed = Ember.computed,
	    getOwner = Ember.getOwner,
	    inject = Ember.inject,
	    RSVP = Ember.RSVP,
	    Service = Ember.Service;
	exports.default = Service.extend({
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
			var _this = this;

			if (this.get('fastboot.isFastBoot')) {
				return;
			}
			if (this.get('isUserAnonymous') === true) {
				return RSVP.reject();
			}
			return this.get('model').loadUnreadNotificationCount().catch(function (err) {
				_this.get('logger').warn('Couldn\'t load notification count', err);
				_this.set('isLoading', false);
			});
		}),

		/**
   * @returns {void}
   */
		init: function init() {
			this._super.apply(this, arguments);
			// fetches the model from the API at first attempt to use the data
			// then a singleton service will keep the data until page reloads
			this.set('model', _notifications.default.create(getOwner(this).ownerInjection()));
			this.get('modelLoader');
		},
		loadFirstPage: function loadFirstPage() {
			var _this2 = this;

			if (this.get('isUserAnonymous') === true || this.get('isLoading') === true || this.get('nextPage') !== null) {
				return;
			}
			this.set('isLoading', true);
			this.get('model').loadFirstPageReturningNextPageLink().then(function (nextPage) {
				_this2.set('nextPage', nextPage);
			}).catch(function (err) {
				_this2.get('logger').warn('Couldn\'t load first page', err);
			}).finally(function () {
				_this2.set('isLoading', false);
			});
		},
		loadNextPage: function loadNextPage() {
			var _this3 = this;

			if (this.get('isUserAnonymous') === true || this.get('isLoading') === true || this.get('nextPage') === null) {
				return;
			}
			this.set('isLoading', true);
			this.get('model').loadPageReturningNextPageLink(this.get('nextPage')).then(function (nextPage) {
				_this3.set('nextPage', nextPage);
			}).catch(function (err) {
				_this3.get('logger').warn('Couldn\'t load more notifications', err);
			}).finally(function () {
				_this3.set('isLoading', false);
			});
		},
		markAllAsRead: function markAllAsRead() {
			this.get('model').markAllAsRead();
		},
		markAsRead: function markAsRead(notification) {
			this.get('model').markAsRead(notification);
		},
		getUnreadCount: function getUnreadCount() {
			return this.get('model.unreadCount');
		}
	});
});