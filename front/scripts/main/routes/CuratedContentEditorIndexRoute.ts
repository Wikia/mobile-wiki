/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface JQuery {
	cropper: any;
}

interface Window {
	define: any;
}

App.CuratedContentEditorIndexRoute = Em.Route.extend({
	renderTemplate(): void {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	}
});
