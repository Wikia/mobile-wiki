import Ember from 'ember';
import getEditToken from '../utils/edit-token';

export default Ember.Mixin.create({
	/**
	 * Sends request to MW API to upvote newId revision of title
	 * @param {string} revisionId ID of revision that is upvoted
	 * @param {string} title Text tilte of article in main namespace which revision is upvoted
	 * @returns {Ember.RSVP.Promise}
	 */
	revisionUpvote(revisionId, title) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			getEditToken(title)
				.then((token) => {
					Ember.$.ajax({
						url: M.buildUrl({
							path: '/wikia.php',
							query: {controller: 'RevisionUpvotesApiController', method: 'addUpvote'}
						}),
						data: {
							revisionId,
							token
						},
						dataType: 'json',
						method: 'POST',
						success: (resp) => {
							if (resp && resp.success) {
								resolve(resp.id);
							} else {
								reject();
							}
						},
						error: (err) => reject(err)
					});
				});
		});
	}
});
