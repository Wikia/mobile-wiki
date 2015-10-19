/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	/**
	 * @param {CuratedContentEditorItemModel} model
	 * @returns {any}
	 */
	serialize(model: CuratedContentEditorItemModel): any {
		return {
			section: model.label
		};
	},

	/**
	 * @param {any} params
	 * @returns {CuratedContentEditorItemModel}
	 */
	model(params: any): CuratedContentEditorItemModel {
		var section: string = decodeURIComponent(params.section),
			rootModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getItem(rootModel['curated'], section);
	},

	/**
	 * @param {any} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			alreadyUsedItemsLabels = App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel);

		this._super(controller, model, transition);
		controller.setProperties({
			alreadyUsedItemsLabels,
			originalSectionLabel: model.label
		});
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		addItem(): void  {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		/**
		 * @param {CuratedContentEditorItemModel} item
		 * @returns {void}
		 */
		editItem(item: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		/**
		 * @returns {void}
		 */
		editSection(): void {
			this.transitionTo('curatedContentEditor.section.edit');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {void}
		 */
		done(newSection: CuratedContentEditorItemModel): void {
			var rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel'),
				isNewSection: boolean = controller.get('isNewSection');

			if (isNewSection) {
				App.CuratedContentEditorModel.addItem(rootModel['curated'], newSection);
				controller.set('isNewSection', null);
			} else {
				App.CuratedContentEditorModel.updateItem(rootModel['curated'], newSection, originalSectionLabel);
			}

			this.transitionTo('curatedContentEditor.index');
		}
	}
});
