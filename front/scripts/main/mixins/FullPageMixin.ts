/// <reference path="../app.ts" />
'use strict';

// This mixin should be considered temporary, until a
// better solution is created with Jira ticket XW-247
App.FullPageMixin = Em.Mixin.create({
	/**
	 * @returns {undefined}
	 */
	activate(): void {
		this.controllerFor('application').set('fullPage', true);
	},

	/**
	 * @returns {undefined}
	 */
	deactivate(): void {
		this.controllerFor('application').set('fullPage', false);
	}
});
