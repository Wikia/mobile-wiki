import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		/**
		 * @desc exits infobox builder ui and calls redirect method on route.
		 * Connect with <iframe> parent to redirect to another page.
		 * @returns {void}
		 */
		cancel() {
			const model = this.get('model'),
				title = model.get('title');

			// maybe some modal "are you sure? You'll lost your work"
			// redirect to template page
			this.get('target').send('redirectToTemplatePage', title);
		},

		/**
		 * @desc Saves infobox state to template and calls redirect method on route.
		 * on model and connect with <iframe> parent to redirect to another page.
		 * @returns {void}
		 */
		save() {
			const model = this.get('model');

			model.saveStateToTemplate().then((title) => this.get('target').send('redirectToTemplatePage', title));
		},

		/**
		 * @desc calls different add item action on model
		 * @param {String} type type
		 * @returns {Object}
		 */
		addItem(type) {
			const model = this.get('model');

			return model.addItem(type);
		},

		/**
		 * @desc removes item from models state
		 * @param {Object} item
		 * @returns {void}
		 */
		removeItem(item) {
			const model = this.get('model');

			model.removeItem(item);
		},

		/**
		 * @desc sets currently edited item on model
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			const model = this.get('model');

			model.setEditItem(item);
		},

		/**
		 * @desc resets edit model if action trigger is different than current item in edit model
		 * @param {Object} actionTrigger - infobox item that triggers this action
		 * @returns {void}
		 */
		handleItemInEditModel(actionTrigger) {
			const model = this.get('model');

			if (actionTrigger !== model.get('itemInEditMode')) {
				model.resetEditMode();
			}
		},

		/**
		 * @desc calls editTitleItem on model with new title data
		 * @param {Object} item
		 * @param {Boolean} shouldUseArticleName
		 * @returns {void}
		 */
		editTitleItem(item, shouldUseArticleName) {
			const model = this.get('model');

			model.editTitleItem(item, shouldUseArticleName);
		},

		/**
		 * @desc calls editRowItem on model with new label value
		 * @param {Object} item
		 * @param {string} label
		 * @returns {void}
		 */
		editRowItem(item, label) {
			const model = this.get('model');

			model.editRowItem(item, label);
		},

		/**
		 * @desc updated models state to new order
		 * @param {Ember.Array} newState
		 * @returns {void}
		 */
		updateInfoboxStateOrder(newState) {
			const model = this.get('model');

			model.updateInfoboxStateOrder(newState);
		}
	}
});
