/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditIndexRoute = Em.Route.extend({
	model: function (): Em.RSVP.Promise {
		return App.CuratedContentEditModel.find();
	},

	renderTemplate: function (): void {
		this.render('curated-content-edit');
	},
});
