/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	model(): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	setupController(
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		this._super(controller, model, transition);
		controller.set('block', transition.params['curatedContentEditor.blockAddItem'].block);
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newItem: typeof App.CuratedContentEditorItemModel) {
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addBlockItem(currentModel, newItem, block);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem() {
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
