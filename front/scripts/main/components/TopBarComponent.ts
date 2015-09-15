/// <reference path="../app.ts" />
/// <reference path="../../main/mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';

App.TopBarComponent = Em.Component.extend(App.HeadroomMixin, {
	tagName: 'top-bar',
	attributeBindings: ['logo-href', 'show-user-status'],
	'logo-href': Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),
	'show-user-status': true,

	isUserLoggedIn: Em.computed('currentUser.isAuthenticated', function () {
		// HTMLBars attribute binding only removes an attribute if it's value is set to null
		if (this.get('currentUser.isAuthenticated') === false) {
			return null;
		}
		return true;
	}),
	links: Em.computed('currentUser.name', function (): Array<any> {
		return [
			{
				href: M.buildUrl({
					namespace: 'User',
					title: this.get('currentUser.name')
				}),
				textKey: 'user-menu-profile'
			},
			{
				href: M.buildUrl({
					namespace: 'Special',
					title: 'UserLogout'
				}),
				textKey: 'user-menu-log-out'
			}
		];
	}),
});
