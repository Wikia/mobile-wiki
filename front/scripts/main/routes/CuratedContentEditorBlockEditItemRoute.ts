/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockEditItemRoute = Em.Route.extend({
	model(params: any): typeof App.CuratedContentEditorItemModel {
		var block: string = params.block,
			item: string = decodeURIComponent(params.item);

		return App.CuratedContentEditorModel.getBlockItem(this.modelFor('curatedContentEditor'), block, item);
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
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.updateBlockItem(currentModel, newItem, block, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				originalItemLabel: string = controller.get('originalItemLabel'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.deleteBlockItem(currentModel, block, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
