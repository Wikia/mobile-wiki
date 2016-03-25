import Ember from 'ember';

export default Ember.Controller.extend({
	// used by ember-onbeforeunload to determine if confirmation dialog should be shown
	isDirty: false,

	actions: {
		/**
		 * Exits infobox builder ui and calls redirect method on route.
		 *
		 * @returns {void}
		 */
		cancel() {
			this.get('target').send('redirectToPage');
		},

		/**
		 * Saves infobox state to template,
		 * sends redirectToPage action to route if desired,
		 * return a promise so it can be chained
		 *
		 * @param {Boolean} [shouldRedirectToPage=true]
		 * @returns {Ember.RSVP.Promise}
		 */
		save(shouldRedirectToPage = true) {
			const model = this.get('model');

			// prevents showing confirmation dialog on save
			this.set('isDirty', false);

			return model.saveStateToTemplate().then((urls = {}) => {
				if (shouldRedirectToPage) {
					this.get('target').send('redirectToPage', urls.templatePageUrl);
				}
			});
		},

		/**
		 * @returns {void}
		 */
		goToSourceEditor() {
			const model = this.get('model');

			// prevents showing confirmation dialog on save
			this.set('isDirty', false);

			this.get('target').send('goToSourceEditor', model.get('title'));
		},

		getTemplateExists(title) {
			return this.get('model').getTemplateExists(title);
		},

		/**
		 * Calls add item method on model
		 *
		 * @param {String} type type
		 * @returns {Object}
		 */
		addItem(type) {
			const model = this.get('model');

			this.set('isDirty', true);

			return model.addItem(type);
		},

		/**
		 * Removes item from models state
		 *
		 * @param {Object} item
		 * @returns {void}
		 */
		removeItem(item) {
			const model = this.get('model');

			this.set('isDirty', true);
			model.removeItem(item);
		},

		/**
		 * Sets currently edited item on model
		 *
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			const model = this.get('model');

			model.setEditItem(item);
		},

		/**
		 * Calls editTitleItem on model with new title data
		 *
		 * @param {Object} item
		 * @param {Boolean} shouldUseArticleName
		 * @returns {void}
		 */
		editTitleItem(item, shouldUseArticleName) {
			const model = this.get('model');

			this.set('isDirty', true);
			model.editTitleItem(item, shouldUseArticleName);
		},

		/**
		 * Calls editSectionHeaderItem on model with new section header data
		 *
		 * @param {Object} item
		 * @param {Object} newValues new section header values
		 * @returns {void}
		 */
		editSectionHeaderItem(item, newValues) {
			const model = this.get('model');

			model.editSectionHeaderItem(item, newValues);
		},

		/**
		 * Calls editRowItem on model with new label value
		 *
		 * @param {Object} item
		 * @param {string} label
		 * @returns {void}
		 */
		editRowItem(item, label) {
			const model = this.get('model');

			this.set('isDirty', true);
			model.editRowItem(item, label);
		},

		/**
		 * Updated models state to new order
		 *
		 * @param {Ember.Array} newState
		 * @returns {void}
		 */
		updateInfoboxStateOrder(newState) {
			const model = this.get('model');

			this.set('isDirty', true);
			model.updateInfoboxStateOrder(newState);
		},

		/**
		 * @returns {Array}
		 */
		getDiffArray() {
			return this.get('model').createDataDiffs();
		}
	}
});
