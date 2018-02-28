import {inject as service} from '@ember/service';
import {alias, readOnly, or} from '@ember/object/computed';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import Component from '@ember/component';
import HeadroomMixin from '../mixins/headroom';
import NotificationsUnreadCountMixin from '../mixins/notifications-unread-count';
import {track, trackActions} from '../utils/track';
import {standalone} from '../utils/browser';

export default Component.extend(
	HeadroomMixin, NotificationsUnreadCountMixin,
	{
		ads: service(),
		notifications: service(),
		smartBanner: service(),

		classNames: ['site-head-container'],
		classNameBindings: ['themeBar', 'partnerSlot:has-partner-slot'],
		tagName: 'div',
		themeBar: false,
		closeIcon: 'close',
		offset: 0,

		defaultWikiaHomePage: 'http://fandom.wikia.com',
		partnerSlot: readOnly('globalNavigation.partner_slot'),
		smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
		shouldShowFandomAppSmartBanner: readOnly('smartBanner.shouldShowFandomAppSmartBanner'),
		isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),

		unreadNotificationsCount: alias('notifications.model.unreadCount'),

		wikiaHomepageFromNav: alias('globalNavigation.logo.module.main.href'),
		wikiaHomepage: or('wikiaHomepageFromNav', 'defaultWikiHomePage'),

		svgName: alias('globalNavigation.logo.module.main.image-data.name'),

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
					this.get('ads.module').onMenuOpen();
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

		/**
		 * @returns {void}
		 */
		willInsertElement() {
			if (this.get('shouldShowFandomAppSmartBanner')) {
				// this HAVE TO be run while rendering, but it cannot be run on didInsert/willInsert
				// running this just after render is working too
				run.scheduleOnce('afterRender', this, this.checkForHiding);
			}
		},

		/**
		 * @returns {void}
		 */
		checkForHiding() {
			const smartBannerService = this.get('smartBanner');

			if (!standalone && !smartBannerService.isCookieSet()) {
				smartBannerService.setVisibility(true);
				smartBannerService.track(trackActions.impression);
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
