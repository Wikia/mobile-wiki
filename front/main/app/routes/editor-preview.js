import Ember from 'ember';
import ArticleModel from '../models/article';

export default Ember.Route.extend({
	model() {
		return ArticleModel.find(Ember.get(Mercury, 'article.data.article'));
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

			return true;
		}
	}
});
