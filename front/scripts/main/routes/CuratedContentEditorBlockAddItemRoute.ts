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

		done(newItem: typeof App.CuratedContentEditorItemModel): void {
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: typeof App.CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.addItem(blockModel, newItem);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
