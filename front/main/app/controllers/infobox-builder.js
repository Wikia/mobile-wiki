import Ember from 'ember';

export default Ember.Controller.extend({
	// used by ember-onbeforeunload to determine if confirmation dialog should be shown
	isDirty: false,
	groupItems: [],
	lastGroupItem: null,
	isVEContext: false,

	actions: {
		/**
		 * Exits infobox builder ui and calls redirect method on route.
		 *
		 * @returns {void}
		 */
		cancel() {
			if (this.get('isVEContext')) {
				this.get('target').send('returnToVE');
			} else {
				this.get('target').send('redirectToPage');
			}
		},

		/**
		 * Saves infobox state to template,
		 * return a promise so it can be chained
		 *
		 * @param {String} initialTitle
		 * @returns {Ember.RSVP.Promise}
		 */
		save(initialTitle) {
			// prevents showing confirmation dialog on save
			this.set('isDirty', false);

			return this.get('model').saveStateToTemplate(initialTitle).then((data) => data);
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
		 * Triggers action to communicate VE that creating infobox is completed
		 *
		 * @param {string} title Title of newly created infobox template
		 * @returns {void}
		 */
		returnToVE(title = null) {
			this.get('target').send('returnToVE', title);
		},

		redirectToPage(url) {
			return this.get('target').send('redirectToPage', url);
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
		},

		setGroup(header) {
			const items = [];
			let last = null;

			if (header && header.type === 'section-header') {
				const state = this.get('model').get('infoboxState');
				let done = false,
					// set start at first group item
					current = state.indexOf(header) + 1;

				items.push(header);
				while (!done && current < state.length) {
					const item = state.get(current);

					switch (item.type) {
						case 'title':
						case 'section-header':
							done = true;
							break;
						default:
							last = item;
							items.push(item);
							break;
					}
					current += 1;
				}
			}
			this.set('groupItems', items);
			this.set('lastGroupItem', last);
		}
	}
});
