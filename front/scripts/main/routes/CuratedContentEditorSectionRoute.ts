/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	model(params: any) {
		var section = decodeURIComponent(params.section),
			currentModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getBlockItem(currentModel, 'curated', section);
	},

	renderTemplate(): void {
		this.render('curated-content-editor-section');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		updateSection(updatedSection: CuratedContentEditorItemInterface): void {
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
