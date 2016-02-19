import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';
import SideNavNewBadge from '../mixins/side-nav-new-badge';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	LoginLinkMixin,
	SideNavNewBadge,
	TrackClickMixin,
	{
		currentUser: Ember.inject.service(),
		hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
		exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

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
			goToLoginPage() {
				this.goToLogin();
			},

			openLocalNavigation() {
				if (this.get('shouldDisplayNewBadge')) {
					this.trackClick('recent-wiki-activity-blue-dot', 'open-local-menu');
				}

				this.sendAction('replaceNavigationContent', 'local');
			}
		}
	}
);
