/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	model(): typeof App.CuratedContentEditorItemModel {
		return this.modelFor('curatedContentEditor.section');
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		// Update section
		done(newSection: typeof App.CuratedContentEditorItemModel): void {
			var sectionModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		// Delete section
		deleteItem(): void {
			var rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel');

			App.CuratedContentEditorModel.deleteItem(rootModel['curated'], originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
