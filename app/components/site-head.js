import { inject as service } from '@ember/service';
import { alias, readOnly, or, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import Component from '@ember/component';
import HeadroomMixin from '../mixins/headroom';
import { track, trackActions } from '../utils/track';
import { standalone } from '../utils/browser';

export default Component.extend(
	HeadroomMixin,
	{
		ads: service(),
		smartBanner: service(),
		router: service(),

		classNames: ['site-head-container'],
		classNameBindings: ['themeBar', 'partnerSlot:has-partner-slot'],
		tagName: 'div',
		themeBar: false,
		offset: 0,

		partnerSlot: readOnly('globalNavigation.partner-slot'),
		smartBannerVisible: readOnly('smartBanner.smartBannerVisible'),
		shouldShowFandomAppSmartBanner: readOnly('smartBanner.shouldShowFandomAppSmartBanner'),
		isFandomAppSmartBannerVisible: readOnly('smartBanner.isFandomAppSmartBannerVisible'),
		canShowContentRecommendations: equal('language', 'en'),

		init() {
			this._super(...arguments);
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

		/**
		 * @returns {void}
		 */
		willInsertElement() {
			if (this.shouldShowFandomAppSmartBanner) {
				// this HAS TO be run while rendering, but it cannot be run on didInsert/willInsert
				// running this just after render is working too
				run.scheduleOnce('afterRender', this, this.checkForHiding);
			}
		},

		/**
		 * @returns {void}
		 */
		checkForHiding() {
			const smartBannerService = this.smartBanner;

			if (!standalone && !smartBannerService.isCookieSet()) {
				smartBannerService.setVisibility(true);
				smartBannerService.track(trackActions.impression);
			}
		},

		track(data) {
			track(data);
		},

		onSearchSuggestionChosen({ uri }) {
			this.router.transitionTo('wiki-page', uri);
		},

		goToSearchResults(value) {
			this.router.transitionTo('search', {
				queryParams: { query: value }
			});
		},

		onLinkClicked(href) {
			// FIXME XW-5099
			if (href.substr(0, 6) === '/wiki/' && href.indexOf(':') === -1) {
				this.router.transitionTo('wiki-page', href.substr(6));
			} else {
				window.location = href;
			}
		}
	}
);
