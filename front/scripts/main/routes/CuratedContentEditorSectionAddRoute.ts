/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		},

		// Update section
		updateItem: function (newSection: typeof App.CuratedContentEditorItemModel): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addBlockItem(currentModel, newSection, 'curated');
			this.transitionTo('curatedContentEditor.section', newSection);
		},

		// Delete section
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
