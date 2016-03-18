import Ember from 'ember';
import DiscussionPost from './post';

const DiscussionPosts = Ember.Object.extend({
	/**
	 * Returns an array of DiscussionPost objects created from API's threads
	 *
	 * @param data
	 *
	 * @returns {array}
	 */
	getNormalizedDataFromThreadData(data) {
		return data.map(function (threadData) {
			return DiscussionPost.createFromThreadData(threadData);
		});
	}
});

export default DiscussionPosts;
