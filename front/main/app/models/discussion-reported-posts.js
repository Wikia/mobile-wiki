import DiscussionBaseModel from './discussion-base';
import DiscussionModerationModelMixin from '../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../mixins/discussion-forum-actions-model';
import ajaxCall from '../utils/ajax-call';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{
		/**
		 * Adds thread data to a post's first level
		 *
		 * @param {object} post
		 *
		 * @returns {void}
		 */
		normalizeThreadData(post) {
			if (Ember.get(post, '_embedded.thread.0')) {
				post.postCount = post._embedded.thread[0].postCount;
			}
		},

		/**
		 * @param {number} pageNum
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0, sortBy = 'trending') {
			this.set('pageNum', pageNum);

			return ajaxCall({
				data: {
					page: this.get('pageNum'),
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false,
					reported: true
				},
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts`),
				success: (data) => {
					const newPosts = data._embedded['doc:posts'];

					let allPosts;

					newPosts.forEach(this.normalizeThreadData);

					allPosts = this.posts.concat(newPosts);
					this.set('posts', allPosts);
				},
				error: (err) => {
					this.handleLoadMoreError(err);
				}
			});
		},

		/**
		 * Create new post in Discussion Service
		 * @param {object} postData
		 * @returns {Ember.RSVP.Promise}
		 */
		createPost(postData) {
			this.setFailedState(null);
			return ajaxCall({
				data: JSON.stringify(postData),
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}/threads`),
				success() {},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		}
	}
);

DiscussionForumModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} [sortBy='trending']
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy = 'trending') {
		const forumInstance = DiscussionForumModel.create({
				wikiId,
				forumId
			}),
			requestData = {
				viewableOnly: false,
				reported: true
			};

		if (sortBy) {
			requestData.sortKey = forumInstance.getSortKey(sortBy);
		}

		return ajaxCall({
			context: forumInstance,
			data: requestData,
			url: M.getDiscussionServiceUrl(`/${wikiId}/posts`),
			success: (data) => {
				const contributors = [],
					embedded = data._embedded,
					posts = embedded && embedded['doc:posts'] ? embedded['doc:posts'] : [],
					pivotId = (posts.length > 0 ? posts[0].id : null),
					totalPosts = data.postCount;

				posts.forEach((post) => {
					if (post.hasOwnProperty('createdBy')) {
						post.createdBy.profileUrl = M.buildUrl({
							namespace: 'User',
							title: post.createdBy.name
						});
						contributors.push(post.createdBy);
					}

					forumInstance.normalizeThreadData(post);
				});

				forumInstance.setProperties({
					contributors,
					name: data.name,
					pivotId,
					posts,
					totalPosts
				});
			},
			error: (err) => {
				forumInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionForumModel;
