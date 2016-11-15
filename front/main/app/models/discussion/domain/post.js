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
	 * Normalizes single entity from post list into a post object
	 *
	 * @param {object} postData
	 *
	 * @returns {Ember.Object}
	 */
	createFromPostListData(postData) {
		const post = DiscussionPost.create({
				categoryName: postData.forumName,
				// A hack to compensate for API sometimes returning numbers and sometimes strings
				categoryId: String(postData.forumId),
				createdBy: DiscussionContributor.create(postData.createdBy),
				creationTimestamp: postData.creationDate.epochSecond,
				id: postData.id,
				isDeleted: postData.isDeleted,
				isLocked: !get(postData, '_embedded.thread.0.isEditable'),
				isNew: postData.isNew,
				isReported: postData.isReported,
				isRequesterBlocked: postData.isRequesterBlocked,
				rawContent: postData.rawContent,
				repliesCount: parseInt(get(postData, '_embedded.thread.0.postCount'), 10),
				threadId: postData.threadId,
				title: postData.title,
				upvoteCount: parseInt(postData.upvoteCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(postData.userBlockDetails)
			}),
			userData = get(postData, '_embedded.userData.0'),
			openGraphData = get(postData, '_embedded.openGraph.0');

		if (openGraphData) {
			post.set('openGraph', OpenGraph.create(openGraphData));
		}

		if (userData) {
			post.set('userData', DiscussionUserData.create(userData));
		}

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
		const post = DiscussionPost.create({
				categoryName: threadData.forumName,
				// A hack to compensate for API sometimes returning numbers and sometimes strings
				categoryId: String(threadData.forumId),
				createdBy: DiscussionContributor.create(threadData.createdBy),
				creationTimestamp: threadData.creationDate.epochSecond,
				id: threadData.firstPostId,
				isDeleted: threadData.isDeleted,
				isLocked: !threadData.isEditable,
				isNew: threadData.isNew,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				openGraph: null,
				permalinkedReplyId: threadData.permalinkedReplyId,
				rawContent: threadData.rawContent,
				repliesCount: parseInt(threadData.postCount, 10),
				threadId: threadData.id,
				title: threadData.title,
				upvoteCount: parseInt(threadData.upvoteCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(threadData.userBlockDetails)
			}),
			userData = get(threadData, '_embedded.userData.0'),
			openGraphData = get(threadData, '_embedded.openGraph.0'),
			contentImagesData = get(threadData, '_embedded.contentImages');

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
});

export default DiscussionPost;
