import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	noAds: Ember.computed.alias('application.noAds'),

	/**
	 * @returns {void}
	 */
	init() {
		this.setProperties({
			mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openCuratedContentItem(item) {
			/**
			 * We have to double encode because Ember's RouteRecognizer does decodeURI while processing path.
			 * If we didn't do encodeURI then it would do decodeURI on a result of our encodeURIComponent
			 * and the title would be malformed.
			 */
			if (item.type === 'section') {
				this.transitionToRoute('mainPageSection', encodeURI(encodeURIComponent(item.label)));
			} else if (item.type === 'category') {
				this.transitionToRoute('mainPageCategory', encodeURI(encodeURIComponent(item.categoryName)));
			} else {
				Ember.Logger.error('Can\'t open curated content item with type other than section or category', item);
			}
		}
	}
});
