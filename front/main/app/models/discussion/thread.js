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

export default DiscussionThread;
