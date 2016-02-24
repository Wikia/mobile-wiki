import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		/**
		 * @returns {void}
		 */
		cancel() {
			this.get('target').send('cancel');
		},

		/**
		 * @returns {void}
		 */
		save() {
			this.get('target').send('save');
		},

		/**
		 * @param {String} type
		 * @returns {void}
		 */
		addItem(type) {
			this.get('target').send('addItem', type);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		removeItem(item) {
			this.get('target').send('removeItem', item);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			debugger;
			this.get('target').send('setEditItem', item);
		},

		/**
		 * @param {TitleItem} item
		 * @param {Object} value new default value
		 * @returns {void}
		 */
		editTitleItem(item, value) {
			this.get('target').send('editTitleItem', item, value);
		},

		/**
		 * @param {RowItem} item
		 * @param {string} value new label value
		 * @returns {void}
		 */
		editRowItem(item, value) {
			this.get('target').send('editRowItem', item, value);
		},

		/**
		 * @param {SectionHeaderItem} item
		 * @param {string} value new label value
		 * @returns {void}
		 */
		editSectionHeaderItem(item, value) {
			this.get('target').send('editSectionHeaderItem', item, value);
		}
	}
});
