/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';

App.UserMenuComponent = Em.Component.extend({
	classNames: ['user-menu'],
	classNameBindings: ['shouldBeVisible:visible:collapsed'],

	isVisible: Em.computed.bool('currentUser.isAuthenticated'),

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

	actions: {
		hide(): void {
			this.sendAction('toggleVisibility', false);
		}
	}
});
