import Ember from 'ember';
import {updateTrackedUrl, trackPageView} from 'common/utils/track';
import ArticleDiffModel from '../models/article-diff';

export default Ember.Route.extend({
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return ArticleDiffModel.fetch(params.oldid, params.newid);
	},

	actions: {
		/**
		 * @returns {boolean}
		 */
		didTransition() {
			updateTrackedUrl(window.location.href);
			trackPageView(null);
			return true;
		}
	}
});
