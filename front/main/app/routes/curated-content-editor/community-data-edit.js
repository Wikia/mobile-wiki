import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @returns {Object} item
	 */
	model() {
		const rootModel= this.modelFor('curatedContentEditor');

		return rootModel.communityData;
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		console.log("setupController! model: ", model)
		this._super(controller, model, transition);
		controller.setProperties({
			isFeaturedItem: false,
			originalItemLabel: model.description
		});
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		console.log("renderTemplate")
		this.render('curated-content-editor/item', {
			into: 'application'
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
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem) {
			debugger
			const controller = this.controllerFor('curatedContentEditor.blockEditItem'),
				block = controller.get('block'),
				originalItemLabel = controller.get('originalItemLabel'),
				rootModel = this.modelFor('curatedContentEditor'),
				blockModel = rootModel[block];

			CuratedContentEditorModel.updateItem(blockModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
