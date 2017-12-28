import {inject as service} from '@ember/service';
import {alias, readOnly, or} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import HeadroomMixin from '../mixins/headroom';
import NotificationsUnreadCountMixin from '../mixins/notifications-unread-count';
import {track, trackActions} from '../utils/track';

export default Component.extend(
	HeadroomMixin, NotificationsUnreadCountMixin,
	{
		ads: service(),
		notifications: service(),
		smartBanner: service(),

		classNames: ['site-head-container'],
		classNameBindings: ['themeBar'],
		tagName: 'div',
		themeBar: false,
		closeIcon: 'close',

		defaultWikiaHomePage: 'http://fandom.wikia.com',

		smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
		shouldShowFandomAppSmartBanner: readOnly('smartBanner.shouldShowFandomAppSmartBanner'),
		isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),

		offset: readOnly('ads.siteHeadOffset'),

		unreadNotificationsCount: alias('notifications.model.unreadCount'),

		wikiaHomepageFromNav: alias('globalNavigation.logo.module.main.href'),
		wikiaHomepage: or('wikiaHomepageFromNav', 'defaultWikiHomePage'),

		svgName: alias('globalNavigation.logo.module.main.image-data.name'),

		displayFandomBar: computed('isSearchPage', function () {
			return Boolean(this.get('globalNavigation.logo.module.tagline')) && !this.get('isSearchPage');
		}),

		navIcon: computed('drawerContent', 'drawerVisible', function () {
			return this.get('drawerVisible') && this.isDrawerInClosableState() ? this.get('closeIcon') : 'nav';
		}),

		searchIcon: computed('drawerContent', 'drawerVisible', function () {
			return this.get('drawerVisible') && this.get('drawerContent') === 'search' ?
				this.get('closeIcon') : 'search';
		}),

		init() {
			this._super(...arguments);

			this.closableDrawerStates = ['nav', 'user-profile'];
			this.headroomOptions = {
				classes: {
					initial: 'site-head-headroom',
					pinned: 'site-head-headroom-pinned',
					unpinned: 'site-head-headroom-un-pinned',
					top: 'site-head-headroom-top',
					notTop: 'site-head-headroom-not-top'
				}
			};
		},

		actions: {
			/**
			 * @param {String} icon
			 * @returns {void}
			 */
			siteHeadIconClick(icon) {
				if (this.get('drawerVisible') && this.canBeClosed(icon)) {
					track({
						action: trackActions.click,
						category: 'side-nav',
						label: `${icon}-collapsed`
					});

					this.get('setDrawerContent')(false);
					this.get('toggleDrawer')(false);
				} else {
					track({
						action: trackActions.click,
						category: 'side-nav',
						label: `${icon}-expanded`
					});

					this.get('setDrawerContent')(icon);
					this.get('toggleDrawer')(true);
				}
			},

			/**
			 * @returns {void}
			 */
			trackWordmarkClick() {
				track({
					action: trackActions.click,
					category: 'wordmark'
				});
			}
		},

		isDrawerInClosableState() {
			return this.get('closableDrawerStates').indexOf(this.get('drawerContent')) !== -1;
		},

		canBeClosed(icon) {
			const drawerContent = this.get('drawerContent');

			return icon === this.getPrimaryDrawerState(drawerContent);
		},

		getPrimaryDrawerState(state) {
			return state === 'user-profile' ? 'nav' : state;
		}
	}
);
