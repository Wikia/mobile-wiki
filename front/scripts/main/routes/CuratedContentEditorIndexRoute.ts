/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

/**
 * JQuery
 * @typedef {object} JQuery
 * @property {any} cropper
 */

/**
 * Window
 * @typedef {object} Window
 * @property {any} define
 */

interface JQuery {
	cropper: any;
}

interface Window {
	define: any;
}

App.CuratedContentEditorIndexRoute = Em.Route.extend({
	/**
	 * @returns {void}
	 */
	renderTemplate(): void {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
