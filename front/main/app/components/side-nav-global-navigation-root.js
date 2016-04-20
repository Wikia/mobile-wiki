import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		currentUser: Ember.inject.service(),
		newFeaturesBadges: Ember.inject.service(),
		hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
		exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),
		shouldDisplayNewBadge: Ember.computed('newFeaturesBadges.features.[]', function () {
			return this.get('newFeaturesBadges').shouldDisplay('recent-wiki-activity');
		}),

		logoutLink: M.buildUrl({
			namespace: 'Special',
			title: 'UserLogout',
		}),

		userProfileLink: Ember.computed('currentUser.name', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name')
			});
		}),

		actions: {
			openLocalNavigation() {
				if (this.get('shouldDisplayNewBadge')) {
					track({
						action: trackActions.click,
						category: 'recent-wiki-activity-blue-dot',
						label: 'open-local-menu'
					});
				}

				this.sendAction('replaceNavigationContent', 'local');
			},

			hubLinkClick(hubName) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: `open-hub-${hubName}`
				});
			},

			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		}
	}
);
