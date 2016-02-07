import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @returns {Object} item
	 */
	model() {
		const rootModel = this.modelFor('curatedContentEditor');

		return rootModel.communityData;
	},

	/**
	 * @param {Object} controller
	 * @param {CuratedContentEditorItemModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);
		controller.setProperties({
			isFeaturedItem: false
		});
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
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @returns {void}
		 */
		done() {
			CuratedContentEditorModel.isDirty = true;
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
