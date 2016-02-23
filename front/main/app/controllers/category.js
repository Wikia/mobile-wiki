import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Controller.extend(
	TrackClickMixin,
	{
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
			loadBatch(index, batch, label) {
				window.document.getElementById(arguments[0]).scrollIntoView();
				window.scrollBy(0, -50);

				this.trackClick('category-load-batch', label);

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
	}
);
