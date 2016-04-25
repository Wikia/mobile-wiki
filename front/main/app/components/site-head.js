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

		//TODO: Remove this code after spitfires remove BlueDot functionality
		shouldDisplayNewBadge: computed('newFeaturesBadges.features.[]', 'visibleNavIcon', function () {
			return this.get('newFeaturesBadges').shouldDisplay('recent-wiki-activity')
					&& this.get('visibleNavIcon') !== this.get('closeIcon');
		}),

		visibleNavIcon: computed('activeIcon', function() {
			return this.get('activeIcon') !== this.get('menuIcon') ? this.get('menuIcon') : this.get('closeIcon');
		}),

		visibleSearchIcon: computed('activeIcon', function() {
			return this.get('activeIcon') !== this.get('searchIcon') ? this.get('searchIcon') : this.get('closeIcon');
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
						//TODO: Remove this code after spitfires remove BlueDot functionality
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

					this.get('setNavigationDrawerContent')(icon);
					this.sendAction('toggleDrawer', true);
				} else {
					track({
						action: trackActions.click,
						category: 'side-nav',
						label: `${icon}-collapsed`
					});

					this.sendAction('toggleDrawer', false);
					this.get('setNavigationDrawerContent')(null);
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
