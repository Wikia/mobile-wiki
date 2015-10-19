/// <reference path="../app.ts" />
'use strict';

/**
 * Handles errors appears in the ajax calls.
 */
App.DiscussionErrorMixin = Em.Mixin.create({
	errorCodes: {
		notFound: 404
	},

	errorClass: 'discussion-error-page',

	/**
	 * @param {any} err
	 * @param {any} model
	 * @returns {void}
	 */
	setErrorProperty: function (err: any, model: any): void {
		if (err.status == this.errorCodes.notFound) {
			model.set('notFoundError', true);
		} else {
			model.set('connectionError', true);
		}

		Em.$('body').addClass(this.errorClass);
	}
});
