App.DiscussionIndexModel = Em.Object.extend({
});

App.DiscussionIndexModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Em.RSVP.Promise}
	 */
	find(wikiId) {
		return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: M.getDiscussionServiceUrl(`/discussion/${wikiId}/forums`),
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	}
});
