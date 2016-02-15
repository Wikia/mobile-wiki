import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import ArticleDiffModel from '../models/article-diff';

export default Ember.Route.extend({
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return ArticleDiffModel.fetch(params.oldId, params.newId);
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		didTransition() {
			track({
				action: trackActions.impression,
				category: 'app',
				label: 'article-diff'
			});
			return true;
		}
	}
});
