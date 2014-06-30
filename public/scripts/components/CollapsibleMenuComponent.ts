/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	isCollapsed: true,
	eventManager: {
		click: function (event: JQueryEventObject): void {
			console.log(event);
		}
	},
	actions: {
		toggleMenu: function (): void {
			this.toggleProperty('isCollapsed');
		}
	}
});
