/// <reference path="../app.ts" />
'use strict';

App.TableOfContentsComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['table-of-contents'],
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
