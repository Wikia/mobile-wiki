/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorIndexRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-editor', {
			model: this.modelFor('curatedContentEditor')
		});
	},
});
