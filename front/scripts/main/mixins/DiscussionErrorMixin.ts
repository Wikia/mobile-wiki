/// <reference path="../app.ts" />
'use strict';

/**
 * Handles errors appears in the ajax calls.
 */
App.DiscussionErrorMixin = Em.Mixin.create({
	httpCodes: {
		notFound: 404,
		ok: 200
	},

	errorClass: 'discussion-error-page',

	/**
	 * @param {*} err
	 * @param {*} model
	 * @returns {void}
	 */
	setErrorProperty(err: any, model: any): void {
		if (err.status == this.httpCodes.notFound) {
			model.set('notFoundError', true);
		} else {
			model.set('connectionError', true);
		}

		Em.$('body').addClass(this.errorClass);
	},

	setPostFailedState(hasFailed: boolean, model: any): void {
		model.set('postFailed', hasFailed);
	}
});
