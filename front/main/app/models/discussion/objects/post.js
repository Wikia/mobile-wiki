import Ember from 'ember';
import DiscussionEntity from './entity';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';

const DiscussionPost = DiscussionEntity.extend({
	contributors: null,
	pivotId: null,
	pageNum: null,
	replies: null,
	repliesCount: null,
	repliesLimit: 10
});

DiscussionPost.reopenClass({
	/**
	 * Normalizes single entity from thread list into a post object
	 *
	 * @param {object} threadData
	 *
	 * @returns {object}
	 */
	createFromThreadListData(threadData) {
		const post = DiscussionPost.create({
				count: threadData.postCount,
				createdBy: DiscussionContributor.create(threadData.createdBy),
				creationDate: threadData.creationDate.epochSecond,
				id: threadData.firstPostId,
				isDeleted: threadData.isDeleted,
				isLocked: !threadData.isEditable,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				rawContent: threadData._embedded.firstPost[0].rawContent,
				threadId: threadData.id,
				title: threadData.title,
				upvoteCount: threadData.upvoteCount,
			}),
			userData = Ember.get(threadData, '_embedded.firstPost.0._embedded.userData.0');

		post.userData = userData ? DiscussionUserData.create(userData) : null;

		return post;
	},

	/**
	 * Normalizes single entity from post list into a post object
	 *
	 * @param {object} postData
	 *
	 * @returns {object}
	 */
	createFromPostListData(postData) {
		const post = DiscussionPost.create({
				repliesCount: postData.postCount,
				createdBy: DiscussionContributor.create(postData.createdBy),
				creationDate: postData.creationDate.epochSecond,
				id: postData.id,
				isDeleted: postData.isDeleted,
				isLocked: !postData.isEditable,
				isReported: postData.isReported,
				isRequesterBlocked: postData.isRequesterBlocked,
				rawContent: postData.rawContent,
				threadId: postData.threadId,
				title: postData.title,
				upvoteCount: postData.upvoteCount,
			}),
			userData = Ember.get(postData, '_embedded.userData.0');

		post.userData = userData ? DiscussionUserData.create(userData) : null;

		return post;
	},

	/**
	 * Normalizes API thread data into a post object
	 *
	 * @param {object} threadData
	 *
	 * @returns {object}
	 */
	createFromThreadData(threadData) {
		const post = DiscussionPost.create({
				repliesCount: threadData.postCount,
				createdBy: DiscussionContributor.create(threadData.createdBy),
				creationDate: threadData.creationDate.epochSecond,
				id: threadData.firstPostId,
				isDeleted: threadData.isDeleted,
				isLocked: !threadData.isEditable,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				rawContent: threadData._embedded.firstPost[0].rawContent,
				threadId: threadData.id,
				title: threadData.title,
				upvoteCount: threadData.upvoteCount,
			}),
			userData = Ember.get(threadData, '_embedded.firstPost.0._embedded.userData.0');

		post.userData = userData ? DiscussionUserData.create(userData) : null;

		return post;
	},
});

export default DiscussionPost;
