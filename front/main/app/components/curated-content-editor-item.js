import Ember from 'ember';
import CuratedContentEditorLayoutMixin from '../mixins/curated-content-editor-layout';

export default Ember.Component.extend(
	CuratedContentEditorLayoutMixin,
	{
		editorLayout: 'curated-content-editor-item-form',

		actions: {
			/**
			 * @returns {void}
			 */
			goBack() {
				this.sendAction('goBack');
			},

			/**
			 * @param {CuratedContentEditorModel} model
			 * @returns {void}
			 */
			done(model) {
				this.sendAction('done', model);
			},

			/**
			 * @returns {void}
			 */
			deleteItem() {
				this.sendAction('deleteItem');
			},

			/**
			 * @param {string} newLayoutName
			 * @returns {void}
			 */
			changeLayout(newLayoutName) {
				this.set('editorLayout', newLayoutName);
			}
		}
	}
);
