/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	model: function(): any {
		var sectionModel = this.modelFor('curatedContentEditor.section');

		return {
			// TODO: Do we still need to pass the block? If yes, can we move it out from the model?
			block: 'curated',
			item: sectionModel
		};
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var sectionModel = this.modelFor('curatedContentEditor.section');
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		updateItem: function (newSection: CuratedContentEditorItemInterface): void {
			var sectionModel = this.modelFor('curatedContentEditor.section');

			// TODO update whole model, not just label
			Em.set(sectionModel, 'label', newSection.label);
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
