/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditBlockItemRouteParamsInterface {
	block: string;
	item: string
}

App.CuratedContentEditorEditBlockItemRoute = Em.Route.extend({
	serialize: function (model: CuratedContentEditorEditBlockItemRouteParamsInterface): any {
		return {
			block: model.block,
			// Sections have titles, section items have labels and titles - we want to show labels for them
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

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

	model: function(params: CuratedContentEditorEditBlockItemRouteParamsInterface) {
		var block = params.block,
			item = params.item,
			itemModel = App.CuratedContentEditorModel.getBlockItem(this.modelFor('curatedContentEditor'), block, item);
		return {
			block: block,
			item: itemModel
		};
	},

	setupController: function(controller, model) {
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
				this.transitionTo('curatedContentEditor.section', currentItemModel.item.title);
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
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
