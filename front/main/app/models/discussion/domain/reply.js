import DiscussionContentImages from './content-images';
import DiscussionContributor from './contributor';
import DiscussionEntity from './entity';
import DiscussionUserData from './user-data';
import OpenGraph from './open-graph';

const {get} = Ember,
	DiscussionReply = DiscussionEntity.extend({
		position: null,
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
				openGraph: null,
				position: postData.position,
				rawContent: postData.rawContent,
				threadCreatedBy: DiscussionContributor.create(postData.threadCreatedBy),
				threadId: postData.threadId,
				title: postData.title,
				upvoteCount: parseInt(postData.upvoteCount, 10),
			}),
			userData = get(postData, '_embedded.userData.0'),
			openGraphData = get(postData, '_embedded.openGraph.0'),
			contentImagesData = get(postData, '_embedded.contentImages');

		if (openGraphData) {
			reply.set('openGraph', OpenGraph.create(openGraphData));
		}

		if (userData) {
			reply.set('userData', DiscussionUserData.create(userData));
		}

		if (!Ember.isEmpty(contentImagesData)) {
			reply.set('contentImages', DiscussionContentImages.create(contentImagesData));
		}

		return reply;
	}
});


export default DiscussionReply;
