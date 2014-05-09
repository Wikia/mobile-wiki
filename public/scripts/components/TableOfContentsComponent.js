'use strict';
Wikia.TableOfContentsComponent = Em.Component.extend({
		tagName: 'nav',
		classNames: ['table-of-contents'],
		isCollapsed: true,
		actions: {
			toggleMenu() {
				this.toggleProperty('isCollapsed');
			}
		}
});
