import Ember from 'ember';
import DiscussionPost from './post';
import DiscussionReplies from './replies';

const DiscussionThread = Ember.Object.extend({
	count: null,
	forumId: null,
	contributors: null,
	pageNum: null,
	pivotId: null,
	post: null,
	replies: null,
	replyLimit: 10,

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
				let newReplies = DiscussionReplies.create(data._embedded['doc:posts']);

				newReplies.reverse();
				newReplies = newReplies.concat(this.get('replies'));
				this.setProperties({
					pageNum: this.pageNum + 1,
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
		replyData.threadId = this.get('id');

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
	},

	/**
	 * Gets a thread context Data from API's data
	 *
	 * @param {object} data
	 *
	 * @returns {object}
	 */
	getNormalizedData(data) {
		return {
			count: data.postCount,
			forumId: data.forumId,
			contributors: null,
			pageNum: data.page,
			pivotId: null,
			post: DiscussionPost.createFromThreadData(data),
			replies: DiscussionReplies.getNormalizedData(data._embedded['doc:posts']),
		}
	},
});

DiscussionThread.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} postId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, postId) {
		const postInstance = DiscussionThread.create({
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
				const contributors = [];
				let pivotId;

				if (replies) {
					pivotId = replies[0].id;
					replies.reverse();
				}

				// making the model a little bit more friendly
				firstPost.isReported = data.isReported;
				firstPost.isLocked = !data.isEditable;

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


export default DiscussionThread;
