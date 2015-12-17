import App from '../app';
import ajaxCall from '../../mercury/utils/ajaxCall.js';

export default App.DiscussionIndexModel = Ember.Object.extend({});

App.DiscussionIndexModel.reopenClass({
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
