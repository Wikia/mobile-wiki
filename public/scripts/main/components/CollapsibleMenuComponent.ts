/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	isCollapsed: true,
	actions: {
		toggleMenu: function (): void {
			this.toggleProperty('isCollapsed');
		}
	}
});
