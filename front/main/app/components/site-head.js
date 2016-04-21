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
