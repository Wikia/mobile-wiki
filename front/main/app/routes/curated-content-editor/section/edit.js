import Ember from 'ember';
import CuratedContentEditorModel from '../../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} model
	 */
	model() {
		return $.extend(true, {}, this.modelFor('curatedContentEditor.section'));
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);

		controller.set('alreadyUsedLabels', CuratedContentEditorModel.getAlreadyUsedLabels(
			this.modelFor('curatedContentEditor').get('curated'), model.label)
		);
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor/item', {
			into: 'application'
		});
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack() {
			const sectionModel = this.modelFor('curatedContentEditor.section');

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {void}
		 */
		done(newSection) {
			const sectionModel = this.modelFor('curatedContentEditor.section');

			Ember.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			const curatedSections = this.modelFor('curatedContentEditor').curated,
				controller = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel = controller.get('originalSectionLabel');

			CuratedContentEditorModel.deleteItem(curatedSections, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
