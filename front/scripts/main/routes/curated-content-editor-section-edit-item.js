import App from '../app';
import CuratedContentEditorModel from '../models/curated-content-editor';

App.CuratedContentEditorSectionEditItemRoute = Ember.Route.extend({
	/**
	 * @param {Object} params
	 * @returns {CuratedContentEditorItemModel} item
	 */
	model(params) {
		const item = decodeURIComponent(params.item),
			sectionModel = this.modelFor('curatedContentEditor.section');

		return CuratedContentEditorModel.getItem(sectionModel, item);
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberState.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		const sectionController = this.controllerFor('curatedContentEditor.section'),
			alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels').filter(
				(item) => item !== model.label
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
				originalItemLabel = this.get('controller.originalItemLabel'),
				sectionController = this.controllerFor('curatedContentEditor.section'),
				alreadyUsedLabels = sectionController.get('alreadyUsedItemsLabels'),
				itemIndex = alreadyUsedLabels.indexOf(originalItemLabel);

			alreadyUsedLabels[itemIndex] = newItem.label;
			sectionController.set('alreadyUsedItemsLabels', alreadyUsedLabels);

			CuratedContentEditorModel.updateItem(sectionModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			const sectionModel = this.modelFor('curatedContentEditor.section'),
				controller = this.controllerFor('curatedContentEditor.section.editItem'),
				originalItemLabel = controller.get('originalItemLabel');

			CuratedContentEditorModel.deleteItem(sectionModel, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});

export default App.CuratedContentEditorSectionEditItemRoute;
