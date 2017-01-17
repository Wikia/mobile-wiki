import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['curated-content', 'mw-content'],
	activeLabel: null,

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openSection(item) {
			this.set('activeLabel', item.label);
			// TODO scroll up, maybe?
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
