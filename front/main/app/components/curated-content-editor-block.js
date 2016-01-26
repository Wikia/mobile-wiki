import Ember from 'ember';
import CuratedContentEditorSortableItemsMixin from '../mixins/curated-content-editor-sortable-items';

export default Ember.Component.extend(
	CuratedContentEditorSortableItemsMixin,
	{
		tagName: 'section',
		classNames: ['curated-content-editor-block'],

		isHelpVisible: false,
		persistentSort: true,

		actions: {
			/**
			 * @returns {void}
			 */
			addItem() {
				this.sendAction('addItem', this.get('block'));
			},

			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @returns {void}
			 */
			editItem(item) {
				this.sendAction('editItem', item, this.get('block'));
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {void}
			 */
			openSection(section) {
				this.sendAction('openSection', section);
			},

			/**
			 * @returns {void}
			 */
			showHelp() {
				this.trackClick('curated-content-editor', 'help-show');
				this.set('isHelpVisible', true);
			}
		}
	}
);
