import Ember from 'ember';
import DiscussionEntity from './entity';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';
import OpenGraph from './open-graph';
import DiscussionUserBlockDetails from './user-block-details';

const DiscussionPost = DiscussionEntity.extend({
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
				isFollowing: postData.isFollowing,
				isLocked: !Ember.get(postData, '_embedded.thread.0.isEditable'),
				isNew: postData.isNew,
				isReported: postData.isReported,
				isRequesterBlocked: postData.isRequesterBlocked,
				rawContent: postData.rawContent,
				repliesCount: parseInt(Ember.get(postData, '_embedded.thread.0.postCount'), 10),
				threadId: postData.threadId,
				title: postData.title,
				upvoteCount: parseInt(postData.upvoteCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(postData.userBlockDetails)
			}),
			userData = Ember.get(postData, '_embedded.userData.0'),
			openGraphData = Ember.get(postData, '_embedded.openGraph.0');

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
				isFollowing: threadData.isFollowing,
				isLocked: !threadData.isEditable,
				isNew: threadData.isNew,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				lastEditedBy: DiscussionContributor.create(threadData.lastEditedBy),
				openGraph: null,
				permalinkedReplyId: threadData.permalinkedReplyId,
				rawContent: threadData.rawContent,
				repliesCount: parseInt(threadData.postCount, 10),
				threadId: threadData.id,
				title: threadData.title,
				upvoteCount: parseInt(threadData.upvoteCount, 10),
				userBlockDetails: DiscussionUserBlockDetails.create(threadData.userBlockDetails)
			}),
			userData = Ember.get(threadData, '_embedded.userData.0'),
			openGraphData = Ember.get(threadData, '_embedded.openGraph.0');

		if (openGraphData) {
			post.set('openGraph', OpenGraph.create(openGraphData));
		}

		if (userData) {
			post.set('userData', DiscussionUserData.create(userData));
		}

		return post;
	},
});

export default DiscussionPost;
