import Ember from 'ember';
import CuratedContentEditorModel from '../../models/curated-content-editor';
import CuratedContentEditorItemModel from '../../models/curated-content-editor-item';

export default Ember.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new section
	 */
	model() {
		return CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
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
			this.modelFor('curatedContentEditor').get('curated'))
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
			this.transitionTo('curatedContentEditor.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newSection
		 * @returns {void}
		 */
		done(newSection) {
			this.transitionTo('curatedContentEditor.section', newSection, {
				queryParams: {
					isNewSection: true
				}
			});
		},

		/**
		 * @returns {void}
		 */
		deleteItem() {
			this.send('goBack');
		}
	}
});
