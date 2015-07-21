/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorAddBlockItemRoute = Em.Route.extend({
	model: function (params: any): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.create({
			block: params.block
		});
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		},

		updateItem: function (newItem: CuratedContentEditorItemInterface) {
			var block = this.modelFor('curatedContentEditor.addBlockItem').block,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				updatedModel: typeof App.CuratedContentEditorModel;

			updatedModel = App.CuratedContentEditorModel.addBlockItem(currentModel, newItem, block);
			currentModel.set('model', updatedModel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
