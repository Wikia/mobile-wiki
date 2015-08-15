/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockEditItemRoute = Em.Route.extend({
	model(params: any): CuratedContentEditorItemModel {
		var block: string = params.block,
			item: string = decodeURIComponent(params.item),
			rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			blockModel: CuratedContentEditorItemModel = rootModel[block];

		return App.CuratedContentEditorModel.getItem(blockModel, item);
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var block = transition.params['curatedContentEditor.blockEditItem'].block,
			modelForCuratedContentEditor = this.modelFor('curatedContentEditor');

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels: block === 'optional' ?
				App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(
					modelForCuratedContentEditor,
					model.label
				) :
				App.CuratedContentEditorModel.getAlreadyUsedLabels(
					modelForCuratedContentEditor.get(block),
					model.label
				),
			block,
			isFeaturedItem: block === 'featured',
			originalItemLabel: model.label
		});
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newItem: CuratedContentEditorItemModel) {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				originalItemLabel: string = controller.get('originalItemLabel'),
				rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.updateItem(blockModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				item: string = controller.get('originalItemLabel'),
				rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.deleteItem(blockModel, item);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
