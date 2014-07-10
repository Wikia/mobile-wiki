/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	// Begin component property defaults
	additionalClasses: null,
	animSpeed: 100,
	isCollapsed: true,
	observe: null,
	ordered: false,
	showMenuIcon: true,
	tLabel: '',
	// End component property
	actions: {
		toggleMenu: function (): void {
			// slide transcluded element
			this.$('.title')
				.nextAll(':not(script)')
				// use animSpeed, components have restricted scope and
				// all relevant data must be explicitly passed into them
				.slideToggle(this.get('animSpeed'));

			this.toggleProperty('isCollapsed');
		}
	},
	didInsertElement: function (): void {
		Ember.addObserver(this, 'observe', this, this.titleDidChange);
	},
	willDestroyElement: function (): void {
		Ember.removeObserver(this, 'observe', this, this.titleDidChange);
	},
	titleDidChange: function (): void {
		if (!this.get('isCollapsed')) {
			this.set('isCollapsed', true);
		}
	}
});
