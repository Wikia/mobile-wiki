import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		items: Ember.computed('hubsLinks', function () {
			console.info(this.get('hubsLinks'));
			console.info(Ember.get(Mercury, 'wiki.navigation2016.localNav'));

			const hubs = this.get('hubsLinks').map(function (item) {
				return {
					type: 'side-nav-menu-item',
					href: item.href,
					name: item.textEscaped,
					trackLabel: `open-hub-${item.specialAttr}`
				};
			});
		}),


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

			linkClick(item) {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: item.trackLabel
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
