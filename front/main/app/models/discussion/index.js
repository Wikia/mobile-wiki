import Ember from 'ember';
import ajaxCall from '../utils/ajax-call';

const DiscussionIndexModel = Ember.Object.extend({});

DiscussionIndexModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId) {
		return ajaxCall({
			url: M.getDiscussionServiceUrl(`/discussion/${wikiId}/forums`)
		});
	}
});

export default DiscussionIndexModel;
