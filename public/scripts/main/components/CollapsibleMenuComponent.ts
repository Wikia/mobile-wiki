/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	isCollapsed: true,
	actions: {
		toggleMenu: function (): void {
			this.$('ol, ul').slideToggle(this.get('animSpeed'));
			this.toggleProperty('isCollapsed');
		}
	},
	didInsertElement: function (): void {
		Ember.addObserver(this, 'title', this, this.titleDidChange);
	},
	willDestroyElement: function (): void {
		Ember.removeObserver(this, 'title', this, this.titleDidChange);
	},
	titleDidChange: function (): void {
		if (!this.get('isCollapsed')) {
			this.set('isCollapsed', true);
		}
	}
});
