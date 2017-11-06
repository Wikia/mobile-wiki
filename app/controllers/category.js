import Controller, {inject as controller} from '@ember/controller';
import {Promise} from 'rsvp';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(
	WikiPageControllerMixin,
	{
		article: controller(),

		actions: {
			/**
			 * @returns {void}
			 */
			articleRendered() {
				this.get('article').send('articleRendered', ...arguments);
			},

			/**
			 * @param {number} page
			 * @returns {Promise}
			 */
			loadPage(page) {
				if (page === null) {
					return Promise.reject(new Error('Page was not provided'));
				}

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
		}
	}
);
