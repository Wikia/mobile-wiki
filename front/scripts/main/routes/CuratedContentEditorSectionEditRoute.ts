/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	model: function(): any {
		return this.modelFor('curatedContentEditor.section');
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var sectionModel: CuratedContentEditorItemInterface = this.modelFor('curatedContentEditor.section');
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		// Update section
		updateItem: function (newSection: CuratedContentEditorItemInterface): void {
			var sectionModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		// Delete section
		deleteItem(): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				originalSectionLabel = this.controllerFor('curatedContentEditor.section').get('originalSectionLabel');

			App.CuratedContentEditorModel.deleteSection(currentModel, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
