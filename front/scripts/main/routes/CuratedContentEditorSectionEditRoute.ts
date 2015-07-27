/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	model: function(): typeof App.CuratedContentEditorItemModel {
		return this.modelFor('curatedContentEditor.section');
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		// Update section
		updateItem: function (newSection: typeof App.CuratedContentEditorItemModel): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		// Delete section
		deleteItem(): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel');

			App.CuratedContentEditorModel.deleteSection(currentModel, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
