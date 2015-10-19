/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
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
		var sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels: string[] = sectionController.get('alreadyUsedItemsLabels');

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', alreadyUsedLabels);
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
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem: CuratedContentEditorItemModel): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels: string[] = sectionController.get('alreadyUsedItemsLabels');

			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels.concat(newItem.label));
			App.CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
