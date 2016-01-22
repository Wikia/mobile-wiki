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

	canDeleteAll: Ember.computed('posts', function () {
		return checkPermissions(this.get('posts')[0], 'canDelete');
	}),

	loadPage(pageNum = 0) {
		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				viewableOnly: false,
				limit: this.replyLimit,
				responseGroup: 'full'
			},
			url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`),
			success: (data) => {
				const newPosts = data._embedded['doc:posts'];

				newPosts.forEach((post) => {
					if (post.hasOwnProperty('createdBy')) {
						post.createdBy.profileUrl = M.buildUrl({
							namespace: 'User',
							title: post.createdBy.name
						});
					}
				});

				this.set('posts', this.posts.concat(newPosts));
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
				let contributors, pivotId, userName;

				// If there are no replies to the first post, 'doc:posts' will not be returned
				if (posts) {
					pivotId = posts[0].id;
					userName = posts[0].createdBy.name;
					contributors = [posts[0].createdBy];
					posts.forEach((post) => {
						if (post.hasOwnProperty('createdBy')) {
							post.createdBy.profileUrl = M.buildUrl({
								namespace: 'User',
								title: post.createdBy.name
							});
						}
					});
				}

				userInstance.setProperties({
					contributors,
					forumId: data.forumId,
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
