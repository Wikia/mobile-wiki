/// <reference path="../app.ts" />
'use strict';

App.CollapsibleMenuComponent = Em.Component.extend(
	App.TrackClickMixin,
	{
		tagName: 'nav',
		classNames: ['collapsible-menu'],
		classNameBindings: ['additionalClasses'],
		additionalClasses: null,
		isCollapsed: true,
		observe: null,
		ordered: false,
		showMenuIcon: true,
		tLabel: '',
		trackingEvent: null,

		actions: {
			/**
			 * @returns {undefined}
			 */
			toggleMenu(): void {
				this.toggleProperty('isCollapsed');

				if (this.trackingEvent !== null) {
					M.track({
						action: M.trackActions.click,
						category: this.get('trackingEvent'),
						label: this.get('isCollapsed') ? 'close' : 'open'
					});
				}
			}
		},

		/**
		 * @returns {undefined}
		 */
		didInsertElement(): void {
			Em.addObserver(this, 'observe', this, this.titleDidChange);
		},

		/**
		 * @returns {undefined}
		 */
		willDestroyElement(): void {
			Em.removeObserver(this, 'observe', this, this.titleDidChange);
		},

		/**
		 * @returns {undefined}
		 */
		titleDidChange(): void {
			if (!this.get('isCollapsed')) {
				this.set('isCollapsed', true);
			}
		},
	}
);
