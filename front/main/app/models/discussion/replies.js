import Ember from 'ember';
import DiscussionReply from './reply';

const DiscussionReplies = Ember.Object.extend({
	/**
	 * Returns an array of DiscussionReplies
	 *
	 * @param data
	 *
	 * @returns {array}
	 */
	getNormalizedData(data) {
		return data.map(function (threadData) {
			return DiscussionReply.create(threadData);
		});
	}
});

export default DiscussionReply;
