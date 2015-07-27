/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		updateItem: function (newItem: typeof App.CuratedContentEditorItemModel): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addSectionItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
