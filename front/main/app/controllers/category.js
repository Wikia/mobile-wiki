import Ember from 'ember';

const {Controller, inject, computed, get, getWithDefault} = Ember;

export default Controller.extend(
	{
		application: inject.controller(),
		article: inject.controller(),
		noAds: computed.alias('application.noAds'),

		/**
		 * @returns {void}
		 */
		init() {
			this._super(...arguments);
			this.setProperties({
				mainPageTitle: get(Mercury, 'wiki.mainPageTitle'),
				siteName: getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
			});
		},

		actions: {
			loadBatch(index, batch) {
				return this.get('model').loadMore(index, batch);
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
	}
);
