/// <reference path="../app.ts" />

App.DiscussionBaseModel = Em.Object.extend({
	wikiId: null,
	forumId: null,

	errorCodes: {
		notFound: 404
	},
	errorClass: 'discussion-error-page',
	connectionError: null,
	notFoundError: null,
	/*  Set minorError true, when you don't want to display error message ex:
	*  404 on infinite scroll, when unable to load no existing pages
	*  404 on "view older replies" button, when unable to load no existing or deleted replies
	*/
	minorError: false,

	setErrorProperty(err: any): void {
		if (err.status == this.errorCodes.notFound) {
			this.set('notFoundError', true);
		} else {
			this.set('connectionError', true);
		}
		Em.$('body').addClass(this.errorClass);
	},

	handleLoadMoreError(err: any): void {
		if (err.status === this.errorCodes.notFound) {
			this.set('minorError', true);
		} else {
			this.setErrorProperty(err);
		}
	}

});
