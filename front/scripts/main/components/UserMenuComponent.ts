/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';

App.UserMenuComponent = Em.Component.extend({
	classNames: ['user-menu'],
	classNameBindings: ['shouldBeVisible:visible:collapsed'],

	links: Em.computed('userName', function (): Array<any> {
		return [
			{
				href: M.buildUrl({
					namespace: 'User',
					title: this.get('userName')
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
		hide: function (): void {
			this.sendAction('toggleVisibility', false);
		}
	}
});
