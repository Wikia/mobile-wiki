import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	article: Ember.inject.controller(),
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
		},

		/**
		 * @returns {void}
		 */
		edit() {
			this.get('article').send('edit', ...arguments);
		},

		/**
		 * @returns {void}
		 */
		addPhoto() {
			this.get('article').send('addPhoto', ...arguments);
		},

		/**
		 * @returns {void}
		 */
		articleRendered() {
			this.get('article').send('articleRendered', ...arguments);
		}
	}
});
