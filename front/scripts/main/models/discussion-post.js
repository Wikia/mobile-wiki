import App from '../app';
import DiscussionBaseModel from './discussion-base';

export default App.DiscussionPostModel = DiscussionBaseModel.extend({

	postId: null,
	pivotId: null,
	replyLimit: 10,
	replies: [],
	firstPost: null,
	upvoteCount: 0,
	postCount: 0,
	page: 0,
	contributors: [],

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	loadNextPage() {
		return new Ember.RSVP.Promise((resolve) => {
			Ember.$.ajax({
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${this.postId}`, {
					responseGroup: 'full',
					sortDirection: 'descending',
					sortKey: 'creation_date',
					limit: this.replyLimit,
					pivot: this.pivotId,
					page: this.page + 1,
					viewableOnly: false
				}),
				xhrFields: {
					withCredentials: true,
				},
				dataType: 'json',
				success: (data) => {
					let newReplies = data._embedded['doc:posts'];

					// Note that we have to reverse the list we get back because how we're displaying
					// replies on the page; we want to see the newest replies first but show them
					// starting with oldest of the current list at the top.
					newReplies.reverse();
					newReplies = newReplies.concat(this.replies);

					this.setProperties({
						replies: newReplies,
						page: this.page + 1
					});

					resolve(this);
				},
				error: (err) => {
					this.handleLoadMoreError(err);
					resolve(this);
				}
			});
		});
	}
});

App.DiscussionPostModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} postId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, postId) {
		return new Ember.RSVP.Promise((resolve) => {
			const postInstance = App.DiscussionPostModel.create({
				wikiId,
				postId
			});

			Ember.$.ajax({
				url: M.getDiscussionServiceUrl(`/${wikiId}/threads/${postId}`, {
					responseGroup: 'full',
					sortDirection: 'descending',
					sortKey: 'creation_date',
					limit: postInstance.replyLimit,
					viewableOnly: false
				}),
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data) => {
					const contributors = [],
						replies = data._embedded['doc:posts'];
					let pivotId;

					// If there are no replies to the first post, 'doc:posts' will not be returned
					if (replies) {
						pivotId = replies[0].id;
						// See note in previous reverse above on why this is necessary
						replies.reverse();

						replies.forEach((reply) => {
							if (reply.hasOwnProperty('createdBy')) {
								reply.createdBy.profileUrl = M.buildUrl({
									namespace: 'User',
									title: reply.createdBy.name
								});
								contributors.push(reply.createdBy);
							}
						});
					}

					postInstance.setProperties({
						contributors,
						firstPost: data._embedded.firstPost[0],
						forumId: data.forumId,
						id: data.id,
						isDeleted: data.isDeleted,
						pivotId,
						page: 0,
						postCount: data.postCount,
						replies,
						title: data.title,
						upvoteCount: data.upvoteCount,
					});
					resolve(postInstance);
				},
				error: (err) => {
					postInstance.setErrorProperty(err);
					resolve(postInstance);
				}
			});
		});
	}
});
