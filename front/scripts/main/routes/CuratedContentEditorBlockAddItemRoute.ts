/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	setupController: function (
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		this._super(controller, model, transition);
		controller.set('block', transition.params['curatedContentEditor.blockAddItem'].block);
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		},

		updateItem: function (newItem: typeof App.CuratedContentEditorItemModel) {
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addBlockItem(currentModel, newItem, block);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
