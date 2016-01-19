import LoginLinkMixin from '../mixins/login-link';

export default Ember.Component.extend(LoginLinkMixin, {

	hubsLinks: Ember.get(Mercury, 'wiki.navigation2016.hubsLinks'),
	exploreWikiaLabel: Ember.get(Mercury, 'wiki.navigation2016.exploreWikia.textEscaped'),
	wikiName: Ember.get(Mercury, 'wiki.siteName'),
	currentUser: Ember.inject.service(),
	isUserAuthenticated: Ember.computed.oneWay('currentUser.isAuthenticated'),

	logoutLink: Ember.computed(() => {
		return {
			href: M.buildUrl({
				namespace: 'Special',
				title: 'UserLogout',
			}),
			textKey: 'user-menu-log-out',
		};
	}),
	userProfileLink: Ember.computed(function () {
		return {
			href: M.buildUrl({
				namespace: 'User',
				title: this.get('currentUser.name'),
			}),
			textKey: 'user-menu-profile',
		};
	}),

	actions: {
		goToLogin() {
			this.goToLogin();
		}
	}
});
