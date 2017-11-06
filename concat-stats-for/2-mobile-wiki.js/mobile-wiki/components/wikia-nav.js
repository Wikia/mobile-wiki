define('mobile-wiki/components/wikia-nav', ['exports', 'mobile-wiki/mixins/login-link', 'mobile-wiki/models/wikia-nav', 'mobile-wiki/mixins/no-scroll', 'mobile-wiki/mixins/notifications-unread-count', 'mobile-wiki/utils/track'], function (exports, _loginLink, _wikiaNav, _noScroll, _notificationsUnreadCount, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var oneWay = Ember.computed.oneWay;
	var Component = Ember.Component;
	var getOwner = Ember.getOwner;
	exports.default = Component.extend(_loginLink.default, _noScroll.default, _notificationsUnreadCount.default, {
		classNames: ['wikia-nav'],
		classNameBindings: ['model.inRoot:wikia-nav--in-root'],

		currentUser: service(),
		notifications: service(),

		isUserAuthenticated: oneWay('currentUser.isAuthenticated'),

		init: function init() {
			this._super.apply(this, arguments);
			this.model = _wikiaNav.default.create(getOwner(this).ownerInjection(), {
				dsGlobalNavigation: this.get('globalNavigation')
			});
			this.clickHandlers = {
				onRandomPageClick: 'loadRandomArticle'
			};
		},
		didRender: function didRender() {
			this._super.apply(this, arguments);
			this.element.scrollTop = 0;
		},


		actions: {
			/**
    * Handles link items click, runs handler provided in item object
    * additionally to tracking and menu reset
    * @param {Object} item side menu item data
    * @returns {void}
    */
			onClick: function onClick(item) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: item.trackCategory ? item.trackCategory : 'side-nav',
					label: item.trackLabel
				});
				this.get('closeDrawer')();
				// reset state
				this.send('goRoot');
				if (item.actionId) {
					var actionName = this.get('clickHandlers.' + item.actionId);

					this.get(actionName)();
				}
			},
			onUsernameClicked: function onUsernameClicked() {
				this.send('trackClick', 'side-nav', 'open-user-profile');
				this.sendAction('setDrawerContent', 'user-profile');
			},
			goRoot: function goRoot() {
				this.get('model').goRoot();
			},
			goBack: function goBack() {
				this.get('model').goBack();
			},
			goToSubNav: function goToSubNav(index) {
				this.get('model').goToSubNav(index);
			},


			/**
    * wrapper for click tracking
    *
    * @param {string} category
    * @param {string} label
    * @returns {void}
    */
			trackClick: function trackClick(category, label) {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: category,
					label: label
				});
			}
		}
	});
});