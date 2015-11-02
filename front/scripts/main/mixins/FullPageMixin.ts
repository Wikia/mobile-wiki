/// <reference path="../app.ts" />
'use strict';

// This mixin should be considered temporary, until a
// better solution is created with Jira ticket XW-247
App.FullPageMixin = Em.Mixin.create({
	/**
	 * @returns {void}
	 */
	activate(): void {
		this.controllerFor('application').set('fullPage', true);
	},

	/**
	 * @returns {void}
	 */
	deactivate(): void {
		this.controllerFor('application').set('fullPage', false);
	}
});
