import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	classNames: ['site-head', 'border-theme-color'],
	classNameBindings: ['themeBar'],
	tagName: 'nav',
	themeBar: false,
	wikiaHomepage: Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),

	currentUser: Ember.inject.service(),
	newFeaturesBadges: Ember.inject.service(),
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

	didRender() {
		if (this.get('shouldDisplayNewBadge')) {
			track({
				action: trackActions.impression,
				category: 'recent-wiki-activity-blue-dot'
			});
		}
	}
});
