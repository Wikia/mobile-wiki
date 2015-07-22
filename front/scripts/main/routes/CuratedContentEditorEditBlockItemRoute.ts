/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditBlockItemRouteParamsInterface {
	block: string;
	item: string
}

App.CuratedContentEditorEditBlockItemRoute = Em.Route.extend({
	model: function(params: CuratedContentEditorEditBlockItemRouteParamsInterface): any {
		var block = params.block,
			item = decodeURIComponent(params.item),
			itemModel = App.CuratedContentEditorModel.getBlockItem(this.modelFor('curatedContentEditor'), block, item);

		return {
			block: block,
			item: itemModel
		};
	},

	setupController: function(controller: any, model: typeof App.CuratedContentEditorItemModel) {
		this._super(controller, model);
		controller.set('model.originalItem', $.extend({}, model.item));
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		},

		updateItem: function (newItem: CuratedContentEditorItemInterface) {
			var block = this.modelFor('curatedContentEditor.editBlockItem').block,
				originalItem = this.modelFor('curatedContentEditor.editBlockItem').originalItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.updateBlockItem(currentModel, newItem, block, originalItem);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			var block = this.modelFor('curatedContentEditor.editBlockItem').block,
				originalItem = this.modelFor('curatedContentEditor.editBlockItem').originalItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.deleteBlockItem(currentModel, block, originalItem);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
