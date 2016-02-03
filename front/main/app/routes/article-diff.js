import Ember from 'ember';
import ArticleDiffModel from '../models/article-diff';

export default Ember.Route.extend({
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return ArticleDiffModel.fetch(params.oldid, params.newid);
	}
});
