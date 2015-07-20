/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorBlockItemRouteParamsInterface {
	block: string;
	item: CuratedContentEditorItemInterface
}

App.CuratedContentEditorBlockItemRoute = Em.Route.extend({
	serialize: function (model: CuratedContentEditorBlockItemRouteParamsInterface): any {
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
	beforeModel: function (transition: any) {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		updateItem: function (updatedEditItemModel: CuratedContentEditorItemInterface) {
			var block = this.context.block,
				item = this.context.item,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				updatedModel: typeof App.CuratedContentEditorModel;

			updatedModel = App.CuratedContentEditorModel.updateBlockItem(currentModel, updatedEditItemModel, block, item);
			currentModel.set('model', updatedModel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
