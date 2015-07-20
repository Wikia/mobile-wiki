/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
///<reference path="../components/CuratedContentEditorBlockComponent.ts"/>

'use strict';

App.CuratedContentEditorAddSectionItemRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	model: function (params: any) {
		return App.CuratedContentEditorItemModel.getEmpty(params);
	},
});
