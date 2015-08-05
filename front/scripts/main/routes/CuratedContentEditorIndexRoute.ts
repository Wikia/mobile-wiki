/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface JQuery {
	cropper: any
}

App.CuratedContentEditorIndexRoute = Em.Route.extend({
	renderTemplate(): void {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	},

	loadingCropper: false,
	cropperPath: '/front/vendor/cropper/dist',

	loadCropper(): JQueryXHR {
		this.set('loadingCropper', true);

		$('<link>')
			.appendTo('head')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', `${this.cropperPath}/cropper.min.css`);

		return Em.$.getScript(`${this.cropperPath}/cropper.min.js`);
	},

	beforeModel(): JQueryXHR {
		if (!$().cropper || !this.get('loadingCropper')) {
			return this.loadCropper();
		}
	}
});
