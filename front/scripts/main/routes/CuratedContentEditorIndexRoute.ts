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

	/**
	 * This is needed as by default cropper will initialize itself as module
	 * if define.amd is truthy
	 * define.amd might be truthy here if ads code is loaded before
	 *
	 * This will be not neeede when we move to module system
	 *
	 * @param {JQueryXHR} promise
	 * @returns {JQueryXHR}
	 */
	suppressDefineAmd(promise: JQueryXHR) {
		var oldAmd: any;

		if (window.define) {
			oldAmd = define.amd;
			define.amd = false;

			return promise.then((): void => {
				define.amd = oldAmd;
			});
		}

		return promise;
	},

	cropperLoadingInitialized: false,
	cropperPath: '/front/vendor/cropper/dist',

	/**
	 * Loads Cropper css and js
	 *
	 * @returns {JQueryXHR}
	 */
	loadCropper(): JQueryXHR {
		this.set('cropperLoadingInitialized', true);

		$('<link>')
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', `${this.cropperPath}/cropper.min.css`)
			.appendTo('head');

		return Em.$.getScript(`${this.cropperPath}/cropper.min.js`);
	},

	activate(): JQueryXHR {
		if (!$().cropper || !this.get('cropperLoadingInitialized')) {
			return this.suppressDefineAmd(
				this.loadCropper()
			);
		}
	}
});
