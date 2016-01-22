import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @param {CuratedContentEditorItemModel} model
	 * @returns {object} serialized label
	 */
	serialize(model) {
		return {
			section: model.label
		};
	},

	/**
	 * @param {Object} params
	 * @returns {CuratedContentEditorItemModel} section
	 */
	model(params) {
		const section = decodeURIComponent(params.section),
			curatedSections = this.modelFor('curatedContentEditor').curated;

		return CuratedContentEditorModel.getItem(curatedSections, section);
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		const rootModel = this.modelFor('curatedContentEditor'),
			alreadyUsedItemsLabels = CuratedContentEditorModel.getAlreadyUsedLabels(rootModel);

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
		goBack() {
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		addItem() {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		/**
		 * @param {CuratedContentEditorItemModel} item
		 * @returns {void}
		 */
		editItem(item) {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		/**
		 * @returns {void}
		 */
		editSection() {
			this.transitionTo('curatedContentEditor.section.edit');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {void}
		 */
		done(newSection) {
			const curatedSections = this.modelFor('curatedContentEditor').curated,
				controller = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel = controller.get('originalSectionLabel'),
				isNewSection = controller.get('isNewSection');

			if (isNewSection) {
				CuratedContentEditorModel.addItem(curatedSections, newSection);
				controller.set('isNewSection', null);
			} else {
				CuratedContentEditorModel.updateItem(curatedSections, newSection, originalSectionLabel);
			}

			this.transitionTo('curatedContentEditor.index');
		}
	}
});
