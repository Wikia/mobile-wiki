import Ember from 'ember';
import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(
	LoginLinkMixin,
	{
		currentUser: Ember.inject.service(),
		hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
		exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
		wikiName: Ember.get(Mercury, 'wiki.siteName'),
		isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

		logoutLink: Ember.computed(() => {
			return M.buildUrl({
				namespace: 'Special',
				title: 'UserLogout',
			});
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
			}
		}
	}
);
