/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockEditItemRoute = Em.Route.extend({
	/**
	 * @param {any} params
	 * @returns {CuratedContentEditorItemModel}
	 */
	model(params: any): CuratedContentEditorItemModel {
		var block: string = params.block,
			item: string = decodeURIComponent(params.item),
			rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			blockModel: CuratedContentEditorItemModel = rootModel[block];

		return App.CuratedContentEditorModel.getItem(blockModel, item);
	},

	/**
	 * @param {any} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var block = transition.params['curatedContentEditor.blockEditItem'].block,
			rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			alreadyUsedLabels = (block === 'optional') ?
				App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel, model.label) :
				App.CuratedContentEditorModel.getAlreadyUsedLabels(rootModel.get(block), model.label);

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
			block,
			isFeaturedItem: block === 'featured',
			originalItemLabel: model.label
		});
	},

	/**
	 * @returns {void}
	 */
	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem: CuratedContentEditorItemModel): void {
			var controller: any = this.controllerFor('curatedContentEditor.blockEditItem'),
				block: string = controller.get('block'),
				originalItemLabel: string = controller.get('originalItemLabel'),
				rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.updateItem(blockModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
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
