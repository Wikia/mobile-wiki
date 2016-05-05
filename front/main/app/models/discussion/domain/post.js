import Ember from 'ember';
import DiscussionEntity from './entity';
import DiscussionContributor from './contributor';
import DiscussionUserData from './user-data';
import OpenGraph from './open-graph';

const DiscussionPost = DiscussionEntity.extend({
	canModerate: null,
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
				createdBy: DiscussionContributor.create(postData.createdBy),
				creationTimestamp: postData.creationDate.epochSecond,
				id: postData.id,
				isDeleted: postData.isDeleted,
				isLocked: !Ember.get(postData, '_embedded.thread.0.isEditable'),
				isNew: postData.isNew,
				isReported: postData.isReported,
				isRequesterBlocked: postData.isRequesterBlocked,
				rawContent: postData.rawContent,
				repliesCount: parseInt(Ember.get(postData, '_embedded.thread.0.postCount'), 10),
				threadId: postData.threadId,
				title: postData.title,
				upvoteCount: parseInt(postData.upvoteCount, 10),
			}),
			userData = Ember.get(postData, '_embedded.userData.0');

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
				createdBy: DiscussionContributor.create(threadData.createdBy),
				creationTimestamp: threadData.creationDate.epochSecond,
				id: threadData.firstPostId,
				isDeleted: threadData.isDeleted,
				isLocked: !threadData.isEditable,
				isNew: threadData.isNew,
				isReported: threadData.isReported,
				isRequesterBlocked: threadData.isRequesterBlocked,
				hasOpenGraph: true,
				openGraph: OpenGraph.create({
					description: 'Some description',
					domain: 'glee.wikia.com',
					id: 2702253634848394020,
					imageHeight: 348,
					imageUrl: 'https://i.ytimg.com/vi/ybQ__WdAqvE/hqdefault.jpg',
					imageWidth: 464,
					siteId: 26337,
					siteName: '@Wikia',
					title: 'Glee TV Show Wiki',
					type: 'website',
					url: 'http://glee.wikia.com/wiki/Glee_TV_Show_Wiki',
				}),
				permalinkedReplyId: threadData.permalinkedReplyId,
				rawContent: Ember.get(threadData, '_embedded.firstPost.0.rawContent'),
				repliesCount: parseInt(threadData.postCount, 10),
				threadId: threadData.id,
				title: threadData.title,
				upvoteCount: parseInt(threadData.upvoteCount, 10),
			}),
			userData = Ember.get(threadData, '_embedded.firstPost.0._embedded.userData.0');

		if (userData) {
			post.set('userData', DiscussionUserData.create(userData));
		}

		return post;
	},
});

export default DiscussionPost;
