/// <reference path="../app.ts" />
'use strict';

/**
 * Handles errors appears in the ajax calls.
 */
App.DiscussionErrorMixin = Em.Mixin.create({
	errorCodes: {
		notFound: 404
	},

	setErrorProperty: function (err: any, model: any): void {
		if (err.status == this.errorCodes.notFound) {
			model.set('notFoundError', true);
		} else {
			model.set('connectionError', true);
		}
	}
});
