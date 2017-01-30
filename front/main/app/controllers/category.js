import Ember from 'ember';

const {Controller, RSVP, inject, get, getWithDefault} = Ember;

export default Controller.extend(
	{
		application: inject.controller(),
		article: inject.controller(),
		queryParams: ['page'],
		page: 1,

		/**
		 * @returns {void}
		 */
		init() {
			this._super(...arguments);
			this.setProperties({
				mainPageTitle: get(Mercury, 'wiki.mainPageTitle'),
				siteName: getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
			});
		},

		actions: {
			/**
			 * @returns {void}
			 */
			articleRendered() {
				this.get('article').send('articleRendered', ...arguments);
			},

			/**
			 * TODO Remove after XW-2583 is released
			 * @param {number} index
			 * @param {number} batch
			 * @returns {Ember.RSVP.Promise}
			 */
			loadBatch(index, batch) {
				return this.get('model').loadMore(index, batch);
			},

			/**
			 * @param {number} direction 1 is next, -1 is previous
			 * @returns {Ember.RSVP.Promise}
			 */
			loadPage(direction) {
				const model = this.get('model'),
					page = model.getPageByDirection(direction);

				if (page !== null) {
					return this.get('model').loadPage(page)
						.then(() => {
							// Documentation says we should do `this.set('page', page)` but it doesn't update the URL
							// It's the same issue as HG-815, but here we bypass it in a better way
							this.transitionToRoute({
								queryParams: {page}
							})
						});
				}

				return RSVP.Promise.reject();
			}
		}
	}
);
