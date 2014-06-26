/// <reference path="../app.ts" />
'use strict';

App.TableOfContentsComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['table-of-contents'],
	isCollapsed: true,
	actions: {
		toggleMenu: function (): void {
			this.toggleProperty('isCollapsed');
		}
	}
});
