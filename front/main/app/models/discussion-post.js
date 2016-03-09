import DiscussionBaseModel from './discussion-base';
import DiscussionModerationModelMixin from '../mixins/discussion-moderation-model';
import ajaxCall from '../utils/ajax-call';

const DiscussionPostModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {

	firstPost: null,
	contributors: [],
	isRequesterBlocked: false,
	isReported: false,

	page: 0,
	postCount: 0,
	postId: null,
	pivotId: null,
	replies: [],
	replyLimit: 10,
	upvoteCount: 0,

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	loadNextPage() {
		return ajaxCall({
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${this.postId}`, {
				limit: this.replyLimit,
				pivot: this.pivotId,
				page: this.page + 1,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			}),
			success: (data) => {
				let newReplies = data._embedded['doc:posts'];

				// Note that we have to reverse the list we get back because how we're displaying
				// replies on the page; we want to see the newest replies first but show them
				// starting with oldest of the current list at the top.
				newReplies.reverse();
				newReplies = newReplies.concat(this.replies);
				this.setProperties({
					page: this.page + 1,
					replies: newReplies
				});
			},
			error: (err) => {
				this.handleLoadMoreError(err);
			}
		});
	},

	createReply(replyData) {
		this.setFailedState(null);
		replyData.threadId = this.get('postId');

		return ajaxCall({
			data: JSON.stringify(replyData),
			method: 'POST',
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts`),
			success: (reply) => {
				reply.isNew = true;
				this.incrementProperty('postCount');
				this.replies.pushObject(reply);
			},
			error: (err) => {
				if (err.status === 401) {
					this.setFailedState('editor.post-error-not-authorized');
				} else {
					this.setFailedState('editor.post-error-general-error');
				}
			}
		});
	}
});

DiscussionPostModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} postId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, postId) {
		const postInstance = DiscussionPostModel.create({
			wikiId,
			postId
		});

		return ajaxCall({
			context: postInstance,
			url: M.getDiscussionServiceUrl(`/${wikiId}/threads/${postId}`, {
				limit: postInstance.replyLimit,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			}),
			success: (data) => {
				const contributors = [],
					firstPost = data._embedded.firstPost[0],
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

				// making the model a little bit more friendly
				firstPost.isReported = data.isReported;
				firstPost.isLocked = data.isEditable;

				postInstance.setProperties({
					contributors,
					forumId: data.forumId,
					firstPost,
					id: data.id,
					page: 0,
					pivotId,
					postCount: data.postCount,
					replies: replies || [],
					title: data.title,
					upvoteCount: data.upvoteCount
				});
			},
			error: (err) => {
				postInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionPostModel;
