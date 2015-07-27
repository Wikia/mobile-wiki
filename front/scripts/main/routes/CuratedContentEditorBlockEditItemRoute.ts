/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorBlockEditItemRouteParamsInterface {
	block: string;
	item: string
}

App.CuratedContentEditorBlockEditItemRoute = Em.Route.extend({
	model: function (params: CuratedContentEditorBlockEditItemRouteParamsInterface): any {
		var block = params.block,
			item = decodeURIComponent(params.item);

		return App.CuratedContentEditorModel.getBlockItem(this.modelFor('curatedContentEditor'), block, item);
	},

	getOtherItemLabels: function (block: string, label: string = null): string[] {
		var items = this.modelFor('curatedContentEditor').get(block).items;

		return items.map(function(item: CuratedContentEditorItemInterface): string {
			return (item.label !== label) ? item.label : null;
		}).filter(String);
	},

	setupController: function (
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		var block = transition.params['curatedContentEditor.blockEditItem'].block;

		this._super(controller, model);
		controller.setProperties({
			originalItemLabel: model.label,
			block: block,
			otherItemLabels: this.getOtherItemLabels(block, model.label)
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
			var controller = this.controllerFor('curatedContentEditor.blockEditItem'),
				block = controller.get('block'),
				originalItemLabel = controller.get('originalItemLabel'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.updateBlockItem(currentModel, newItem, block, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			var controller = this.controllerFor('curatedContentEditor.blockEditItem'),
				block = controller.get('block'),
				originalItemLabel = controller.get('originalItemLabel'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.deleteBlockItem(currentModel, block, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
