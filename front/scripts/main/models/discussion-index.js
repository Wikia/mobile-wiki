import App from '../app';
import ajaxCall from '../../mercury/utils/ajaxCall.js';

export default App.DiscussionIndexModel = Ember.Object.extend({});

App.DiscussionIndexModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			ajaxCall({
				url: M.getDiscussionServiceUrl(`/discussion/${wikiId}/forums`),
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	}
});
