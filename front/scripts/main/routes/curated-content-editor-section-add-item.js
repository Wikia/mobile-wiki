
import CuratedContentEditorModel from '../models/curated-content-editor';
import CuratedContentEditorItemModel from '../models/curated-content-editor-item';

const CuratedContentEditorSectionAddItemRoute = Ember.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new item
	 */
	model() {
		return CuratedContentEditorItemModel.createNew();
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		const sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels');

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', alreadyUsedLabels);
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		this.render('curated-content-editor-item');
	},

	actions: {
		/**
		 * @returns {void}
		 */
		goBack() {
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem) {
			const sectionModel = this.modelFor('curatedContentEditor.section'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels');

			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels.concat(newItem.label));
			CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});

export default CuratedContentEditorSectionAddItemRoute;
