/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditIndexRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-edit', {
			model: this.modelFor('curatedContentEdit')
		});
	},
});
