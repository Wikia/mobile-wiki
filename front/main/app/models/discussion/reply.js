import Ember from 'ember';
import DiscussionItem from './item';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';

const DiscussionReply = DiscussionItem.extend({
	/**
	 * Creates a reply object from API's post data
	 *
	 * @param postData
	 *
	 * @returns {object}
	 */
	create(postData) {
		return this._super({
			createdBy: DiscussionContributor.create(postData.createdBy),
			id: postData.id,
			isDeleted: postData.isDeleted,
			isLocked: !postData.isEditable,
			isReported: !postData.isReported,
			isRequesterBlocked: postData.isRequesterBlocked,
			rawContent: postData.rawContent,
			threadId: postData.threadId,
			title: postData.title,
			upvoteCount: postData.upvoteCount,
			userData: DiscussionUserData.create(
				postData._embedded.userData
			)
		});
	}
});

export default DiscussionReply;
