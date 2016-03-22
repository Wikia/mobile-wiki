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
	 * @param threadCount
	 *
	 * @returns {array}
	 */
	createFromThreads(threadsData, threadCount) {
		const entities = threadsData.map(function (threadData) {
			return DiscussionPost.createFromThreadData(threadData);
		});

		return DiscussionEntities.create({
			postCount: threadCount,
			entities
		});
	},

	/**
	 * Returns an array of DiscussionPost objects created from API's posts
	 *
	 * @param postsData
	 * @param postCount
	 *
	 * @returns {array}
	 */
	createFromPosts(postsData, postCount) {
		const entities = postsData.map(function (postData) {
			if (postData.isReply === true) {
				return DiscussionReply.create(postData);
			}
			return DiscussionPost.createFromPostData(postData);
		});

		return DiscussionEntities.create({
			postCount,
			entities
		});
	}
});

export default DiscussionEntities;
