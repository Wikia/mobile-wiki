import Ember from 'ember';
import DiscussionPost from './post';

const DiscussionEntities = Ember.Object.extend({
	postCount: null,
	entities: null,
});

DiscussionEntities.reopenClass({
	/**
	 * Returns an array of DiscussionPost objects created from API's threads
	 *
	 * @param threadsData
	 *
	 * @returns {array}
	 */
	createFromThreadsData(threadsData) {
		return threadsData.map(function (threadData) {
			return DiscussionPost.createFromThreadListData(threadData);
		});
	},

	/**
	 * Returns an array of DiscussionPost objects created from API's posts
	 *
	 * @param postsData
	 *
	 * @returns {array}
	 */
	createFromPostsData(postsData) {
		return postsData.map(function (postData) {
			if (postData.isReply === true) {
				return DiscussionReply.create(postData);
			}

			return DiscussionPost.createFromPostData(postData);
		});
	},
});

export default DiscussionEntities;
