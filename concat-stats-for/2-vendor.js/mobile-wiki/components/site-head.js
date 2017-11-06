define('mobile-wiki/components/site-head', ['exports', 'mobile-wiki/mixins/headroom', 'mobile-wiki/mixins/notifications-unread-count', 'mobile-wiki/utils/track'], function (exports, _headroom, _notificationsUnreadCount, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var alias = Ember.computed.alias;
	var readOnly = Ember.computed.readOnly;
	var computed = Ember.computed;
	var Component = Ember.Component;
	exports.default = Component.extend(_headroom.default, _notificationsUnreadCount.default, {
		classNames: ['site-head-container'],
		classNameBindings: ['themeBar'],
		tagName: 'div',
		themeBar: false,
		closableDrawerStates: ['nav', 'user-profile'],
		closeIcon: 'close',

		ads: service(),
		notifications: service(),

		headroomOptions: {
			classes: {
				initial: 'site-head-headroom',
				pinned: 'site-head-headroom-pinned',
				unpinned: 'site-head-headroom-un-pinned',
				top: 'site-head-headroom-top',
				notTop: 'site-head-headroom-not-top'
			}
		},

		wikiaHomepage: alias('globalNavigation.logo.module.main.href') || 'http://fandom.wikia.com',

		displayFandomBar: computed('isSearchPage', function () {
			return Boolean(this.get('globalNavigation.logo.module.tagline')) && !this.get('isSearchPage');
		}),

		svgName: alias('globalNavigation.logo.module.main.image-data.name'),

		navIcon: computed('drawerContent', 'drawerVisible', function () {
			return this.get('drawerVisible') && this.isDrawerInClosableState() ? this.get('closeIcon') : 'nav';
		}),

		searchIcon: computed('drawerContent', 'drawerVisible', function () {
			return this.get('drawerVisible') && this.get('drawerContent') === 'search' ? this.get('closeIcon') : 'search';
		}),

		offset: readOnly('ads.siteHeadOffset'),

		unreadNotificationsCount: alias('notifications.model.unreadCount'),

		isDrawerInClosableState: function isDrawerInClosableState() {
			return this.get('closableDrawerStates').indexOf(this.get('drawerContent')) !== -1;
		},
		canBeClosed: function canBeClosed(icon) {
			var drawerContent = this.get('drawerContent');

			return icon === this.getPrimaryDrawerState(drawerContent);
		},
		getPrimaryDrawerState: function getPrimaryDrawerState(state) {
			return state === 'user-profile' ? 'nav' : state;
		},


		actions: {
			/**
    * @param {String} icon
    * @returns {void}
    */
			siteHeadIconClick: function siteHeadIconClick(icon) {
				if (this.get('drawerVisible') && this.canBeClosed(icon)) {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: 'side-nav',
						label: icon + '-collapsed'
					});

					this.get('setDrawerContent')(false);
					this.get('toggleDrawer')(false);
				} else {
					(0, _track.track)({
						action: _track.trackActions.click,
						category: 'side-nav',
						label: icon + '-expanded'
					});

					this.get('setDrawerContent')(icon);
					this.get('toggleDrawer')(true);
				}
			},


			/**
    * @returns {void}
    */
			trackWordmarkClick: function trackWordmarkClick() {
				(0, _track.track)({
					action: _track.trackActions.click,
					category: 'wordmark'
				});
			}
		}
	});
});