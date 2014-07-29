/// <reference path="../app.ts" />
'use strict';

App.SideNavComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['collapsed'],
	collapsed: true,
	actions: {
		expandSideNav: function (): void {
			this.set('collapsed', false);
			Ember.$('body').addClass('no-scroll');
		},
		collapseSideNav: function (): void {
			this.set('collapsed', true);
			Ember.$('body').removeClass('no-scroll');
		}
	}
});
