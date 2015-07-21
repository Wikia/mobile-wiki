/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	serialize(model: any) {
		return {
			section: model.originalTitle
		}
	},

	model(params: any) {
		var section = decodeURIComponent(params.section),
			currentModel = this.modelFor('curatedContentEditor'),
			data = App.CuratedContentEditorModel.getBlockItem(currentModel, 'curated', section);

		return {
			originalTitle: section,
			data: data
		};
	},

	renderTemplate(): void {
		this.render('curated-content-editor-section');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		updateSection(newSection: CuratedContentEditorItemInterface): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				originalTitle = this.modelFor('curatedContentEditor.section').originalTitle,
				oldSection = App.CuratedContentEditorModel.getBlockItem(currentModel, 'curated', originalTitle);

			App.CuratedContentEditorModel.updateBlockItem(currentModel, newSection, 'curated', oldSection);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
