import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @returns {Object} item
	 */
	model() {
		return this.modelFor('curatedContentEditor').communityData;
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
