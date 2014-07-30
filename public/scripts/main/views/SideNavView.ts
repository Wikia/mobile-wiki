/// <reference path="../app.ts" />
'use strict';

App.SideNavView = Em.View.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['isCollapsed:collapsed'],
	isCollapsed: true,
	layoutName: 'view/side-nav',
	actions: {
		expandSideNav: function (): void {
			this.set('isCollapsed', false);
			Ember.$('body').addClass('no-scroll');
		},
		collapseSideNav: function (): void {
			this.set('isCollapsed', true);
			Ember.$('body').removeClass('no-scroll');
		}
	}
});
