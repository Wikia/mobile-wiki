import Ember from 'ember';
import ArticlePreviewModel from '../models/article-preview';

/**
 * Important: This route won't work when running `ember fastboot`, for details see `fastboot-server.js`
 * In order to enable this route you need to run `npm run build` and `npm run fastboot-server`
 */
export default Ember.Route.extend({
	fastboot: Ember.inject.service(),
	wikiVariables: Ember.inject.service(),

	model() {
		const shoebox = this.get('fastboot.shoebox');

		if (this.get('fastboot.isFastBoot')) {
			const requestBody = this.get('fastboot._fastbootInfo.request.body');

			const model = ArticlePreviewModel.create({
				host: this.get('wikiVariables.host')
			});

			return model.articleFromMarkup(requestBody.title, requestBody.wikitext, requestBody.CKmarkup)
				.then((articleData) => {
					shoebox.put('articleData', articleData);
					return articleData;
				});
		} else {
			return shoebox.retrieve('articleData');
		}
	},

	actions: {
		/**
		 * @param {*} error
		 * @param {EmberStates.Transition} transition
		 * @returns {boolean}
		 */
		error(error, transition) {
			Ember.Logger.error(error);
			if (transition) {
				transition.abort();
			}
		},

		/**
		 * @returns {Boolean} returns true
		 */
		didTransition() {
			this.controllerFor('application').set('fullPage', true);
			return true;
		}
	}
});
