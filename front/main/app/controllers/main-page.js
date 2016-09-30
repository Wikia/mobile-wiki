import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	/**
	 * @returns {void}
	 */
	init() {
		this.setProperties({
			mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
		});
	},

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openCuratedContentItem(item) {
			if (item.type === 'section') {
				this.transitionToRoute('mainPageSection', encodeURIComponent(item.label));
			} else if (item.type === 'category') {
				this.transitionToRoute('mainPageCategory', encodeURIComponent(item.categoryName));
			} else {
				Ember.Logger.error('Can\'t open curated content item with type other than section or category', item);
			}
		}
	}
});
