/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	classNameBindings: ['additionalClasses'],
	// Begin component property defaults
	additionalClasses: null,
	animSpeed: 100,
	isCollapsed: true,
	observe: null,
	ordered: false,
	showMenuIcon: true,
	tLabel: '',
	trackingEvent: null,
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

			// Track opening and closing menu
			if (this.trackingEvent !== null) {
				Wikia.Utils.track(this.trackingEvent, {
					trackingMethod: 'both',
					category: 'mercury',
					action: 'click',
					label: this.isCollapsed === false ? 'open' : 'close'
				});
			}
		}
	},
	didInsertElement: function (): void {
		Em.addObserver(this, 'observe', this, this.titleDidChange);
	},
	willDestroyElement: function (): void {
		Em.removeObserver(this, 'observe', this, this.titleDidChange);
	},
	titleDidChange: function (): void {
		if (!this.get('isCollapsed')) {
			this.set('isCollapsed', true);
		}
	}
});
