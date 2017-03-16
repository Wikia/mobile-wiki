import Ember from 'ember';

const {Controller, computed, RSVP, inject} = Ember;

export default Controller.extend(
	{
		application: inject.controller(),
		article: inject.controller(),
		wikiVariables: inject.service(),

		mainPageTitle: computed.reads('wikiVariables.mainPageTitle'),
		siteName: computed('wikiVariables', function () {
			return this.get('wikiVariables.siteName') || 'Fandom powered by Wikia';
		}),

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
			 * @param {number} page
			 * @returns {Ember.RSVP.Promise}
			 */
			loadPage(page) {
				const model = this.get('model');

				if (page !== null) {
					return this.get('model').loadPage(page)
						.then(() => {
							// Documentation says we should do `this.set('page', page)` but it doesn't update the URL
							// It's the same issue as HG-815, but here we bypass it in a better way
							// TODO figure out how to remove the param instead of going to ?page=1
							this.transitionToRoute({
								queryParams: {page}
							});

							this.get('target').send('updateDynamicHeadTags');
						});
				}

				return RSVP.Promise.reject('Page was not provided');
			}
		}
	}
);
