/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

<<<<<<< HEAD
	getOtherItemLabels: function (block: string): string[] {
		var items = this.modelFor('curatedContentEditor').get(block).items;

		return items.map((item: CuratedContentEditorItemInterface): string => { return item.label }).filter(String);
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
=======
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		controller.set('block', transition.params['curatedContentEditor.blockAddItem'].block);
>>>>>>> origin/CONCF-806
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newItem: CuratedContentEditorItemModel): void {
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.addItem(blockModel, newItem);
			this.transitionTo('curatedContentEditor.index');
		},

		deleteItem(): void {
			this.send('goBack');
		}
	}
});
