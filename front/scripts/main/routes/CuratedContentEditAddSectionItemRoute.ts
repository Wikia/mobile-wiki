/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
///<reference path="../components/CuratedContentEditBlockComponent.ts"/>

'use strict';

App.CuratedContentEditAddSectionItemRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-edit-item');
	},

	model: function (params: any) {
		return App.CuratedContentEditItemModel.getEmpty(params);
	},
});
