/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	getOtherItemLabels: function (block: string): string[] {
		var items = this.modelFor('curatedContentEditor').get(block).items;

		return items.map(function(item: CuratedContentEditorItemInterface): string {
			return item.label;
		}).filter(String);
	},

	setupController: function (
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		var block = transition.params['curatedContentEditor.blockAddItem'].block;

		this._super(controller, model);
		controller.setProperties({
			block: block,
			otherItemLabels: this.getOtherItemLabels(block)
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
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addBlockItem(currentModel, newItem, block);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
