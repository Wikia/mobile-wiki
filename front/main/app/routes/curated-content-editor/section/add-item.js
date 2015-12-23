import Ember from 'ember';
import CuratedContentEditorModel from '../../../models/curated-content-editor';
import CuratedContentEditorItemModel from '../../../models/curated-content-editor-item';

export default Ember.Route.extend({
	/**
	 * @returns {CuratedContentEditorItemModel} new item
	 */
	model() {
		return CuratedContentEditorItemModel.createNew();
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
			this.transitionTo('curatedContentEditor.section.index');
		},

		/**
		 * @param {CuratedContentEditorItemModel} newItem
		 * @returns {void}
		 */
		done(newItem) {
			const sectionModel = this.modelFor('curatedContentEditor.section');

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
