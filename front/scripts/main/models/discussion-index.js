import App from '../app';
import {getDiscussionServiceUrl} from '../../baseline/mercury/utils/buildUrl';

App.DiscussionIndexModel = Ember.Object.extend({
});

App.DiscussionIndexModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: getDiscussionServiceUrl(`/discussion/${wikiId}/forums`),
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	}
});

export default App.DiscussionIndexModel;
