/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = App.BaseComponent.extend({
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
			var animSpeed = ~~this.get('animSpeed');
			if (animSpeed > 0) {
				// slide transcluded element
				this.$('.title')
					.nextAll(':not(script)')
					// use animSpeed, components have restricted scope and
					// all relevant data must be explicitly passed into them
					.slideToggle(animSpeed);
			} else {
				// Toggle hide/show only
				this.$('.title')
					.nextAll(':not(script)')
					.toggle();
			}

			this.toggleProperty('isCollapsed');

			// Track opening and closing menu
			if (this.trackingEvent !== null) {
				M.track({
					action: M.trackActions.click,
					category: this.get('trackingEvent'),
					label: this.isCollapsed ? 'close' : 'open'
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
