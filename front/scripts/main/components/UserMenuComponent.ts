/// <reference path="../app.ts" />
'use strict';

App.UserMenuComponent = Em.Component.extend({
	classNames: ['user-menu'],
	classNameBindings: ['isCollapsed:collapsed:visible'],

	isCollapsed: true,

	profileUrl: Em.computed(function (): string {
		return '//community.wikia.com/wiki/User:' + this.get('userName');
	}),

	logoutUrl: '/logout',

	actions: {
		hide: function (): void {
			this.set('isCollapsed', true);
		}
	}
});

