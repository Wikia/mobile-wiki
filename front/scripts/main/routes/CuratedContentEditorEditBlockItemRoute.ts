/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditBlockItemRouteParamsInterface {
	block: string;
	item: string
}

App.CuratedContentEditorEditBlockItemRoute = Em.Route.extend({
	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any): void {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	model: function(params: CuratedContentEditorEditBlockItemRouteParamsInterface): typeof App.CuratedContentEditorItemModel {
		var block = params.block,
			item = params.item,
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
			var currentItemModel = this.modelFor('curatedContentEditor.editBlockItem');

			if (currentItemModel.block === 'regular') {
				this.transitionTo('curatedContentEditor.section', encodeURIComponent(currentItemModel.item.title));
			} else {
				this.transitionTo('curatedContentEditor.index');
			}
		},

		updateItem: function (updatedEditItemModel: CuratedContentEditorItemInterface) {
			var block = this.modelFor('curatedContentEditor.editBlockItem').block,
				oldItem = this.modelFor('curatedContentEditor.editBlockItem').originalItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				updatedModel: typeof App.CuratedContentEditorModel;

			updatedModel = App.CuratedContentEditorModel.updateBlockItem(currentModel, updatedEditItemModel, block, oldItem);
			currentModel.set('model', updatedModel);

			if (block === 'regular') {
				this.transitionTo('curatedContentEditor.section', encodeURIComponent(updatedEditItemModel.title));
			} else {
				this.transitionTo('curatedContentEditor.index');
			}
		}
	}
});
