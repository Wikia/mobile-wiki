/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/track.ts" />
'use strict';

App.TrackClickMixin = Em.Mixin.create({
	/**
	 * @param {string} category
	 * @param {string} [label='']
	 * @param {boolean} [isNonInteractive=true]
	 * @returns {undefined}
	 */
	trackClick: function(category: string, label: string = '', isNonInteractive: boolean = true): void {
		M.track({
			action: M.trackActions.click,
			category: category,
			label: label,
			isNonInteractive: isNonInteractive
		});
	},

	actions: {
		/**
		 * @param {string} category
		 * @param {string} [label='']
		 * @param {boolean} [isNonInteractive=true]
		 * @returns {undefined}
		 */
		trackClick(category: string, label: string = '', isNonInteractive: boolean = true): void {
			this.trackClick(category, label, isNonInteractive);
		}
	}
});
