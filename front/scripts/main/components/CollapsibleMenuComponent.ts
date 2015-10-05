/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend(App.TrackClickMixin, {
	tagName: 'nav',
	classNames: ['collapsible-menu'],
	classNameBindings: ['additionalClasses'],
	// Begin component property defaults
	additionalClasses: null,
	isCollapsed: true,
	observe: null,
	ordered: false,
	showMenuIcon: true,
	tLabel: '',
	trackingEvent: null,
	// End component property
	actions: {
		toggleMenu(): void {
			this.toggleProperty('isCollapsed');

			// Track opening and closing menu
			if (this.trackingEvent !== null) {
				M.track({
					action: M.trackActions.click,
					category: this.get('trackingEvent'),
					label: this.get('isCollapsed') ? 'close' : 'open'
				});
			}
		}
	},
	didInsertElement(): void {
		Em.addObserver(this, 'observe', this, this.titleDidChange);
	},
	willDestroyElement(): void {
		Em.removeObserver(this, 'observe', this, this.titleDidChange);
	},
	titleDidChange(): void {
		if (!this.get('isCollapsed')) {
			this.set('isCollapsed', true);
		}
	}
});
