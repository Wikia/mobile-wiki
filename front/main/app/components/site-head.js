import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const {computed, inject, Component} = Ember;

export default Component.extend({
	classNames: ['site-head-wrapper'],
	classNameBindings: ['themeBar'],
	tagName: 'div',
	themeBar: false,
	closeIcon: 'close',

	newFeaturesBadges: inject.service(),

	isNewBadgeVisible: computed.alias('shouldDisplayNewBadge'),

	// TODO: Remove this code after spitfires remove BlueDot functionality
	// https://wikia-inc.atlassian.net/browse/CE-3623
	shouldDisplayNewBadge: computed('newFeaturesBadges.features.[]', 'visibleNavIcon', function () {
		return this.get('newFeaturesBadges').shouldDisplay('recent-wiki-activity') &&
			this.get('visibleNavIcon') !== this.get('closeIcon');
	}),

	visibleNavIconName: computed('activeIcon', function () {
		const navIcon = this.get('navIcon');

		return this.get('activeIcon') === navIcon ? this.get('closeIcon') : navIcon;
	}),

	visibleSearchIconName: computed('activeIcon', function () {
		const searchIcon = this.get('searchIcon');

		return this.get('activeIcon') === searchIcon ? this.get('closeIcon') : searchIcon;
	}),

	didRender() {
		if (this.get('isNewBadgeVisible')) {
			track({
				action: trackActions.impression,
				category: 'recent-wiki-activity-blue-dot'
			});
		}
	},

	/**
	 * BlueDot tracking
	 *
	 * TODO: Remove this code after spitfires remove BlueDot functionality
	 * https://wikia-inc.atlassian.net/browse/CE-3623
	 *
	 * @param {String} icon clicked icon
	 * @returns {void}
	 */
	trackBlueDot(icon) {
		if (icon === this.get('menuIcon') && this.get('shouldDisplayNewBadge')) {
			track({
				action: trackActions.click,
				category: 'recent-wiki-activity-blue-dot',
				label: 'open-navigation'
			});
		}
	},

	actions: {
		/**
		 * @param {String} icon
		 * @returns {void}
		 */
		siteHeadIconClick(icon) {
			if (icon === this.get('activeIcon')) {

				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `${icon}-collapsed`
				});

				this.get('setDrawerContent')(null);
				this.get('toggleDrawer')(false);
			} else {
				this.trackBlueDot(icon);

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
	}
});
