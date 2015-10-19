/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel}
	 */
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	/**
	 * @param {any} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(
			this.modelFor('curatedContentEditor').get('curated'))
		);
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
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {void}
		 */
		done(newSection: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section', newSection, {
				queryParams: {
					isNewSection: true
				}
			});
		},

		// Delete section
		/**
		 * @returns {void}
		 */
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
