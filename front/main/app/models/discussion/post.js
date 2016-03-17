import Ember from 'ember';
import DiscussionItem from 'item';
import DiscussionContributor from 'contributor';
import DiscussionUserData from 'user-data';

const DiscussionPost = DiscussionItem.extend({
	count: null,
});

DiscussionPost.reopenClass({
	/**
	 * Normalizes API thread data into a post object
	 *
	 * @param threadData
	 *
	 * @returns {object}
	 */
	createFromThreadData(threadData) {
		return DiscussionPost.create({
			count: threadData.postCount,
			createdBy: DiscussionContributor.getNormalizedData(threadData.createdBy),
			id: threadData.firstPostId,
			isDeleted: threadData.isDeleted,
			isLocked: !threadData.isEditable,
			isReported: threadData.isReported,
			isRequesterBlocked: threadData,isRequesterBlocked,
			rawContent: threadData._embedded.firstPost.rawContent,
			threadId: threadData.id,
			title: threadData.title,
			upvoteCount: threadData.upvoteCount,
			userData: DiscussionUserData.create(
				threadData._embedded.firstPost._embedded.userData
			)
		});
	},

	/**
	 * Normalizes API post data into a post object
	 *
	 * @param postData
	 *
	 * @returns {object}
	 */
	createFromPostData(postData) {
		return DiscussionPost.create({
			count: postData.postCount,
			createdBy: DiscussionContributor.getNormalizedData(postData.createdBy),
			id: postData.id,
			isDeleted: postData.isDeleted,
			isLocked: !postData.isEditable,
			isReported: postData.isReported,
			isRequesterBlocked: postData,isRequesterBlocked,
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

export default DiscussionPost;
