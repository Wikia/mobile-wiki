import DiscussionBaseModel from './discussion-base';
import DiscussionDeleteModelMixin from '../mixins/discussion-delete-model';
import ajaxCall from '../utils/ajax-call';
import {checkPermissions} from 'common/utils/discussionPermissions';


const DiscussionUserModel = DiscussionBaseModel.extend(DiscussionDeleteModelMixin, {
	contributors: [],
	pageNum: null,
	replyLimit: 10,
	userId: null,
	userName: null,
	posts: null,
	totalPosts: null,
	userProfileUrl: null,

	canDeleteAll: Ember.computed('posts', function () {
		const posts = this.get('posts');

		// TODO fix me when API starts sending permissions for bulk operations
		return posts && checkPermissions(posts[0], 'canDelete');
	}),

	loadPage(pageNum = 0) {
		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				viewableOnly: false,
				limit: this.get('replyLimit'),
				responseGroup: 'full'
			},
			url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`),
			success: (data) => {
				const newPosts = data._embedded['doc:posts'];

				newPosts.forEach((post) => {
					if (post.hasOwnProperty('createdBy')) {
						post.createdBy.profileUrl = this.get('userProfileUrl');
					}
				});

				this.set('posts', this.get('posts').concat(newPosts));
			},
			error: (err) => {
				this.handleLoadMoreError(err);
			}
		});
	}
});

DiscussionUserModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} userId
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, userId) {
		const userInstance = DiscussionUserModel.create({
			wikiId,
			userId
		});

		return ajaxCall({
			context: userInstance,
			url: M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`),
			data: {
				limit: userInstance.replyLimit,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			},
			success: (data) => {
				const posts = data._embedded['doc:posts'];
				let contributors, firstPost, pivotId, userProfileUrl, userName;

				// If there are no replies to the first post, 'doc:posts' will not be returned
				if (posts) {
					firstPost = posts[0];
					pivotId = firstPost.id;
					userName = firstPost.createdBy.name;
					contributors = [firstPost.createdBy];
					userProfileUrl = M.buildUrl({
						namespace: 'User',
						title: firstPost.createdBy.name
					});

					posts.forEach((post) => {
						if (post.hasOwnProperty('createdBy')) {
							post.createdBy.profileUrl = userProfileUrl;
						}
					});
				}

				userInstance.setProperties({
					contributors,
					forumId: wikiId,
					userName,
					page: 0,
					pivotId,
					totalPosts: data.postCount,
					posts: posts || []
				});
			},
			error: (err) => {
				userInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionUserModel;
