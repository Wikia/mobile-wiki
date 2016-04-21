import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';
import {track, trackActions, trackExperiment} from 'common/utils/track';

export default Ember.Component.extend(
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

		// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
		// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
		headroomEnabled: Ember.computed('navABTestIsBarMenuIcon', 'navABTestIsBarDropdownIcon', function () {
			return !this.get('navABTestIsBarMenuIcon') && !this.get('navABTestIsBarDropdownIcon');
		}),

		shouldDisplaySearchIcon: Ember.computed(
			'navABTestIsBarMenuIcon', 'navABTestIsBarDropdownIcon', 'navABTestIsFabMenuIcon',
			function () {
				return this.get('navABTestIsFabMenuIcon') ||
					this.get('navABTestIsBarMenuIcon') ||
					this.get('navABTestIsBarDropdownIcon');
			}),

		shouldDisplayHamburgerIcon: Ember.computed('navABTestIsFabSearchIcon', 'navABTestIsBarMenuIcon', function () {
			return this.get('navABTestIsFabSearchIcon') || this.get('navABTestIsBarMenuIcon');
		}),

		shouldDisplayDropdownIcon: Ember.computed.alias('navABTestIsBarDropdownIcon'),

		actions: {
			/**
			 * @returns {void}
			 */
			expandSideNav() {
				if (this.get('shouldDisplayNewBadge')) {
					track({
						action: trackActions.click,
						category: 'recent-wiki-activity-blue-dot',
						label: 'open-navigation'
					});
				}

				if (this.get('navABTestIsControlGroup')) {
					trackExperiment(this.get('navABTestExperimentName'), {
						action: trackActions.click,
						category: 'entrypoint',
						label: 'site-head-icon'
					});
				}

				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'expanded'
				});
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
