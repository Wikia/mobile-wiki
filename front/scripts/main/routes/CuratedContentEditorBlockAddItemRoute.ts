/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorBlockAddItemRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel}
	 */
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {any} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var block = transition.params['curatedContentEditor.blockAddItem'].block,
			rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			alreadyUsedLabels = (block === 'optional') ?
				App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel) :
				App.CuratedContentEditorModel.getAlreadyUsedLabels(rootModel.get(block));

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
			block,
			isFeaturedItem: block === 'featured'
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
			var block = this.controllerFor('curatedContentEditor.blockAddItem').get('block'),
				rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				blockModel: CuratedContentEditorItemModel = rootModel[block];

			App.CuratedContentEditorModel.addItem(blockModel, newItem);
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
