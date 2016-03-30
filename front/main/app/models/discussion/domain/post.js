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
	 * Normalizes single entity from post list into a post object
	 *
	 * @param {object} postData
	 *
	 * @returns {Ember.Object}
	 */
	createFromPostListData(postData) {
		const post = DiscussionPost.create({
				repliesCount: postData.postCount,
				createdBy: DiscussionContributor.create(postData.createdBy),
				creationTimestamp: postData.creationDate.epochSecond,
				id: postData.id,
				isDeleted: postData.isDeleted,
				isLocked: !Ember.get(postData, '_embedded.thread.isEditable'),
				isNew: postData.isNew,
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
	 * @returns {Ember.Object}
	 */
	createFromThreadData(threadData) {
		const post = DiscussionPost.create({
				repliesCount: threadData.postCount,
				createdBy: DiscussionContributor.create(threadData.createdBy),
				creationTimestamp: threadData.creationDate.epochSecond,
				id: threadData.firstPostId,
				isDeleted: threadData.isDeleted,
				isLocked: !threadData.isEditable,
				isNew: threadData.isNew,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				rawContent: Ember.get(threadData, '_embedded.firstPost.0.rawContent'),
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
