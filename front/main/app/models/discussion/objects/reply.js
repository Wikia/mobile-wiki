import DiscussionEntity from './entity';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';

const DiscussionReply = DiscussionEntity.extend({});

DiscussionReply.reopenClass({
	/**
	 * Creates a reply object from API's post data
	 *
	 * @param {object} postData
	 *
	 * @returns {Ember.Object}
	 */
	create(postData) {
		return this._super({
			createdBy: DiscussionContributor.create(postData.createdBy),
			creationTimestamp: postData.creationDate.epochSecond,
			id: postData.id,
			isDeleted: postData.isDeleted,
			isLocked: !postData.isEditable,
			isNew: postData.isNew,
			isReply: true,
			isReported: postData.isReported,
			isRequesterBlocked: postData.isRequesterBlocked,
			rawContent: postData.rawContent,
			threadId: postData.threadId,
			title: postData.title,
			upvoteCount: postData.upvoteCount,
			userData: DiscussionUserData.create(
				Ember.get(postData, '_embedded.userData.0')
			)
		});
	}
});


export default DiscussionReply;
