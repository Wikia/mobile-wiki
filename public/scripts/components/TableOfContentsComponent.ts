/// <reference path="../app.ts" />
'use strict';

Wikia.TableOfContentsComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['table-of-contents'],
	isCollapsed: true,
	actions: {
		toggleMenu: function (): void {
			this.toggleProperty('isCollapsed');
		}
	}
});
