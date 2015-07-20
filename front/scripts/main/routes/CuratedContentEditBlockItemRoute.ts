/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditBlockItemRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-edit-item');
	},

	serialize: function (model: CuratedContentEditBlockItemInterface) {
		return {
			block: model.block,
			// Sections have titles, section items have labels and titles - we want to show labels for them
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

	model: function (params: any) {
		return App.CuratedContentEditItemModel().getItem(params);
	},

	actions: {
		updateItem: function (updatedEditItemModel: CuratedContentEditBlockItemInterface) {
			var block = this.context.block,
				item = this.context.item,
				currentModel: typeof App.CuratedContentEditModel = this.modelFor('curatedContentEdit'),
				updatedModel: typeof App.CuratedContentEditModel;

			updatedModel = App.CuratedContentEditModel.updateBlockItem(currentModel, updatedEditItemModel, block, item);
			currentModel.set('model', updatedModel);
			this.transitionTo('curatedContentEdit.index');
		}
	},

	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any) {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEdit.index');
		}
	}
});
