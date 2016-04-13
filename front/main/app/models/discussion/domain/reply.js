import DiscussionEntity from './entity';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';

const DiscussionReply = DiscussionEntity.extend({
	threadCreatedBy: null,
});

DiscussionReply.reopenClass({
	/**
	 * Creates a reply object from API's post data
	 *
	 * @param {object} postData
	 *
	 * @returns {Ember.Object}
	 */
	create(postData) {
		const reply = this._super({
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
				threadCreatedBy: DiscussionContributor.create(postData.threadCreatedBy),
				title: postData.title,
				upvoteCount: parseInt(postData.upvoteCount, 10),
			}),
			userData = Ember.get(postData, '_embedded.userData.0');

		if (userData) {
			reply.set('userData', DiscussionUserData.create(userData));
		}

		return reply;
	}
});


export default DiscussionReply;
