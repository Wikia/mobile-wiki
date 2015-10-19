/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditItemRoute = Em.Route.extend({
	/**
	 * @param {any} params
	 * @returns {CuratedContentEditorItemModel}
	 */
	model(params: any): CuratedContentEditorItemModel {
		var item: string = decodeURIComponent(params.item),
			sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

		return App.CuratedContentEditorModel.getItem(sectionModel, item);
	},

	/**
	 * @param {any} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels: string[] = sectionController.get('alreadyUsedItemsLabels').filter(
				(item: string): boolean => item !== model.label
			);

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedLabels,
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
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem: CuratedContentEditorItemModel): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section'),
				originalItemLabel: string = this.get('controller.originalItemLabel'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels: string[] = sectionController.get('alreadyUsedItemsLabels'),
				itemIndex = alreadyUsedLabels.indexOf(originalItemLabel);

			alreadyUsedLabels[itemIndex] = newItem.label;
			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels);

			App.CuratedContentEditorModel.updateItem(sectionModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem(): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section'),
				controller: any = this.controllerFor('curatedContentEditor.section.editItem'),
				originalItemLabel: string = controller.get('originalItemLabel');

			App.CuratedContentEditorModel.deleteItem(sectionModel, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
