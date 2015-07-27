/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model(): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		done(newItem: typeof App.CuratedContentEditorItemModel): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		deleteItem(): void {
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
