import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';

export default Ember.Route.extend({
	/**
	 * @returns {Object} item
	 */
	model() {
		return Ember.copy(this.modelFor('curatedContentEditor').communityData);
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
		 * @param {Ember.Object} newState
		 * @returns {void}
		 */
		done(newState) {
			CuratedContentEditorModel.updateCommunityData(
				this.modelFor('curatedContentEditor'),
				newState
			);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
