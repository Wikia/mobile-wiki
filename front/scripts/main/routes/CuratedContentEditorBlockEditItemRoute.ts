/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockEditItemRoute = Em.Route.extend({
	model(params: any): typeof App.CuratedContentEditorItemModel {
		var block: string = params.block,
			item: string = decodeURIComponent(params.item),
			rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			blockModel: typeof App.CuratedContentEditorItemModel = rootModel[block];

		return App.CuratedContentEditorModel.getItem(blockModel, item);
	},

	setupController(
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		this._super(controller, model, transition);
		controller.setProperties({
			originalItemLabel: model.label,
			block: transition.params['curatedContentEditor.blockEditItem'].block
		});
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newItem: typeof App.CuratedContentEditorItemModel) {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				originalItemLabel: string = controller.get('originalItemLabel'),
				rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: typeof App.CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.updateItem(blockModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				item: string = controller.get('originalItemLabel'),
				rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: typeof App.CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.deleteItem(blockModel, item);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
