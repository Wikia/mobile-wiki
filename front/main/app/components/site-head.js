import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import HeadroomMixin from '../mixins/headroom';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	TrackClickMixin,
	HeadroomMixin,
	{
		classNames: ['site-head', 'border-theme-color'],
		classNameBindings: ['themeBar'],
		tagName: 'nav',
		themeBar: false,
		wikiaHomepage: Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),
		pinned: true,

		currentUser: Ember.inject.service(),
		newFeaturesBadges: Ember.inject.service(),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),
		shouldDisplayNewBadge: Ember.computed('newFeaturesBadges.features.[]', function () {
			return this.get('newFeaturesBadges').shouldDisplay('recent-wiki-activity');
		}),

		shouldDisplaySearchIcon: Ember.computed('navABTestIsFabSearchIcon', 'navABTestIsBarMenuIcon', 'navABTestIsBarDropdownIcon', function() {
			return this.get('navABTestIsFabSearchIcon') || this.get('navABTestIsBarMenuIcon') || this.get('navABTestIsBarDropdownIcon');
		}),

		shouldDisplayHamburgerIcon: Ember.computed('navABTestIsFabSearchIcon', 'navABTestIsBarMenuIcon', function() {
			return this.get('navABTestIsFabSearchIcon') || this.get('navABTestIsBarMenuIcon');
		}),

		actions: {
			/**
			 * @returns {void}
			 */
			expandSideNav() {
				if (this.get('shouldDisplayNewBadge')) {
					this.trackClick('recent-wiki-activity-blue-dot', 'open-navigation');
				}

				this.trackClick('side-nav', 'expanded');
				this.sendAction('toggleSideNav', true);
			},

			/**
			 * @returns {void}
			 */
			showUserMenu() {
				this.sendAction('toggleUserMenu', true);
			}
		},

		pinnedObserver: Ember.observer('pinned', function () {
			this.sendAction('toggleSiteHeadPinned', this.get('pinned'));
		}),
		didRender() {
			if (this.get('shouldDisplayNewBadge')) {
				track({
					action: trackActions.impression,
					category: 'recent-wiki-activity-blue-dot'
				});
			}
		}
	}
);
