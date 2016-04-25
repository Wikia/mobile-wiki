import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';
import {track, trackActions} from 'common/utils/track';

const {computed, inject} = Ember;

export default Ember.Component.extend(
	HeadroomMixin,
	{
		classNames: ['site-head', 'border-theme-color'],
		classNameBindings: ['themeBar'],
		tagName: 'nav',
		themeBar: false,
		pinned: true,
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

		pinnedObserver: Ember.observer('pinned', function () {
			this.sendAction('toggleSiteHeadPinned', this.get('pinned'));
		}),


		didRender() {
			if (this.get('isNewBadgeVisible')) {
				track({
					action: trackActions.impression,
					category: 'recent-wiki-activity-blue-dot'
				});
			}
		},

		actions: {
			/**
			 * @param {String} icon
			 * @returns {void}
			 */
			siteHeadIconClick(icon) {
				if (icon !== this.get('activeIcon')) {
					if (icon === this.get('menuIcon') && this.get('shouldDisplayNewBadge')) {
						// TODO: Remove this code after spitfires remove BlueDot functionality
						// https://wikia-inc.atlassian.net/browse/CE-3623
						track({
							action: trackActions.click,
							category: 'recent-wiki-activity-blue-dot',
							label: 'open-navigation'
						});
					}

					track({
						action: trackActions.click,
						category: 'side-nav',
						label: `${icon}-expanded`
					});

					this.get('setDrawerContent')(icon);
					this.sendAction('toggleDrawer', true);
				} else {
					track({
						action: trackActions.click,
						category: 'side-nav',
						label: `${icon}-collapsed`
					});

					this.sendAction('toggleDrawer', false);
					this.get('setDrawerContent')(null);
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
	}
);
