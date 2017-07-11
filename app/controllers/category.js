import Ember from 'ember';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

const {Controller, RSVP, inject} = Ember;

export default Controller.extend(
	WikiPageControllerMixin,
	{
		article: inject.controller(),

		actions: {
			/**
			 * @returns {void}
			 */
			articleRendered() {
				this.get('article').send('articleRendered', ...arguments);
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
