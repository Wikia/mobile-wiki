import Ember from 'ember';
import CategoryModel from '../models/mediawiki/category';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	noAds: Ember.computed.alias('application.noAds'),

	/**
	 * @returns {void}
	 */
	init() {
		this._super(...arguments);
		this.setProperties({
			mainPageTitle: Ember.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	actions: {
		loadMore() {
			return this.get('model').loadMore(...arguments);
		}
	}
});
