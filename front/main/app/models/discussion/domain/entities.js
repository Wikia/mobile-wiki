import Ember from 'ember';
import DiscussionPost from './post';
import DiscussionReply from './reply';

const DiscussionEntities = Ember.Object.extend({
	entities: null,
	postCount: null,
});

DiscussionEntities.reopenClass({
	/**
	 * Returns an array of DiscussionPost objects created from API's threads
	 *
	 * @param {array} threadsData
	 *
	 * @returns {array}
	 */
	createFromThreadsData(threadsData) {
		return threadsData.map((threadData) => DiscussionPost.createFromThreadData(threadData));
	},

	/**
	 * Returns an array of DiscussionPost objects created from API's posts
	 *
	 * @param {array} postsData
	 *
	 * @returns {array}
	 */
	createFromPostsData(postsData) {
		return postsData.map((postData) => {
			if (postData.isReply === true) {
				return DiscussionReply.create(postData);
			}

			return DiscussionPost.createFromPostListData(postData);
		});
	},
});

export default DiscussionEntities;
