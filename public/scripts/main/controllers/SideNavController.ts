/// <reference path="../app.ts" />
'use strict';

App.SideNavController = Em.Controller.extend({
	isCollapsed: true,
	actions: {
		expandSideNav: function (): void {
			debugger;
			this.set('isCollapsed', false);
			Ember.$('body').addClass('no-scroll');
		},
		collapseSideNav: function (): void {
			this.set('isCollapsed', true);
			Ember.$('body').removeClass('no-scroll');
		}
	}
});
