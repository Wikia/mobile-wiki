import Ember from 'ember';
import DiscussionEntity from './entity';
import DiscussionContentImages from './content-images';
import DiscussionContributor from './contributor';
import DiscussionUserBlockDetails from './user-block-details';
import DiscussionUserData from './user-data';
import OpenGraph from './open-graph';

const {get} = Ember,
	DiscussionPost = DiscussionEntity.extend({
		canModerate: null,
		categoryName: null,
		contributors: null,
		forumId: null,
		isNextLink: null,
		isPreviousPage: null,
		pageNum: null,
		permalinkedReplyId: null,
		pivotId: null,
		replies: null,
		repliesCount: null,
		repliesLimit: 10
	});

DiscussionPost.reopenClass({

	/**
	 * @private
	 * Create base discussion post model.
	 *
	 * @param data - object with common properties
	 */
	createFrom(data) {
		const post = DiscussionPost.create({
				categoryName: data.forumName,
				// A hack to compensate for API sometimes returning numbers and sometimes strings
				categoryId: String(data.forumId),
				createdBy: DiscussionContributor.create(data.createdBy),
				creationTimestamp: data.creationDate.epochSecond,
				isDeleted: data.isDeleted,
				isNew: data.isNew,
				isReported: data.isReported,
				isRequesterBlocked: data.isRequesterBlocked,
				rawContent: data.rawContent,
				title: data.title,
				upvoteCount: parseInt(data.upvoteCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(data.userBlockDetails),
				userData: null,
				openGraph: null,
				contentImages: null
			}),
			userData = get(data, '_embedded.userData.0'),
			openGraphData = get(data, '_embedded.openGraph.0'),
			contentImagesData = get(data, '_embedded.contentImages');

		if (userData) {
			post.set('userData', DiscussionUserData.create(userData));
		}

		if (openGraphData) {
			post.set('openGraph', OpenGraph.create(openGraphData));
		}

		if (!Ember.isEmpty(contentImagesData)) {
			post.set('contentImages', DiscussionContentImages.create(contentImagesData));
		}

		return post;
	},

	/**
	 * Normalizes single entity from post list into a post object
	 *
	 * @param {object} postData
	 *
	 * @returns {Ember.Object}
	 */
	createFromPostListData(postData) {
		const post = DiscussionPost.createFrom(postData);

		post.setProperties({
			id: postData.id,
			isLocked: !get(postData, '_embedded.thread.0.isEditable'),
			repliesCount: parseInt(get(postData, '_embedded.thread.0.postCount'), 10),
			threadId: postData.threadId
		});

		return post;
	},

	/**
	 * Normalizes API thread data into a post object
	 *
	 * @param {object} threadData
	 *
	 * @returns {Ember.Object}
	 */
	createFromThreadData(threadData) {
		const post = DiscussionPost.createFrom(threadData);

		post.setProperties({
			id: threadData.firstPostId,
			isLocked: !threadData.isEditable,
			permalinkedReplyId: threadData.permalinkedReplyId,
			repliesCount: parseInt(threadData.postCount, 10),
			threadId: threadData.id,
		});

		return post;
	}
});

export default DiscussionPost;
