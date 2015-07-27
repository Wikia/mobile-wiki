/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model: function (params: any): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.create({
			section: decodeURIComponent(params.section)
		});
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		updateItem: function (newItem: CuratedContentEditorItemInterface) {
			var sectionModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addSectionItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
