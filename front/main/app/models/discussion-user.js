import DiscussionBaseModel from './discussion-base';
import DiscussionDeleteModelMixin from '../mixins/discussion-delete-model';
import ajaxCall from '../utils/ajax-call';

const DiscussionUserModel = DiscussionBaseModel.extend(DiscussionDeleteModelMixin, {

	contributors: [],
	pageNum: null,
	replyLimit: 10,
	userId: null,
	userName: null,
	posts: null,

	loadPage(pageNum = 0) {
		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				viewableOnly: false
			},
			url: M.getDiscussionServiceUrl(`/${this.get('wikiId')}/users/${this.get('userId')}/posts`),
			success: (data) => {
				const newPosts = data._embedded['doc:threads'],
					allPosts = this.posts.concat(newPosts);

				this.set('posts', allPosts);
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
			url: M.getDiscussionServiceUrl(`/${wikiId}/users/${userId}/posts`, {
				limit: userInstance.replyLimit,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			}),
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
					id: data.id,
					userName,
					page: 0,
					pivotId,
					postCount: data.postCount,
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
