/// <reference path="../app.ts" />
'use strict';

App.ArticleAddPhotoComponent = Em.Component.extend({
	actions: {
		/**
		 * @returns {undefined}
		 */
		back(): void {
			this.sendAction('back');
			this.track('back');
		},

		/**
		 * @returns {undefined}
		 */
		upload(): void {
			this.sendAction('upload');
			this.track('upload');
		},
	},

	/**
	 * @param {string} label
	 * @returns {undefined}
	 */
	track(label: string): void {
		M.track({
			action: M.trackActions.click,
			category: 'sectionaddphoto',
			label: label
		});
	},
});
