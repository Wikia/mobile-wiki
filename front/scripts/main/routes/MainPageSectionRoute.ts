/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';
//FIXME
App.MainPageSectionRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentModel.fetchItemsForSection(params.sectionName, 'section');
	},

	// TODO can we remove it?
	renderTemplate: function() {
		this.render('mainPageSection', {into: 'application'});
	}
});
