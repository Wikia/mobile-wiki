import Ember from 'ember';
import DiscussionBaseModel from './discussion-base';
import DiscussionModerationModelMixin from '../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../mixins/discussion-forum-actions-model';
import ajaxCall from '../utils/ajax-call';
import DiscussionContributors from 'discussion/contributors';

const DiscussionForum = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{
		contributors: null,
		count: null,
		forumId: null,
		pageNum: 0,
		pivotId: null,
		posts: null,
		wikiId: null,

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
					viewableOnly: false
				},
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
				success: (data) => {
					const newPosts = data._embedded['doc:threads'];
					let allPosts;

					allPosts = this.get('posts').concat(
						DiscussionPosts.getNormalizedData(newPosts)
					);

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
				success: (post) => {
					post._embedded.firstPost[0].isNew = true;

					this.normalizePostData(post);

					this.posts.insertAt(0, post);
					this.incrementProperty('totalPosts');
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		},

		/**
		 * @param {object} data
		 *
		 * @returns {object}
		 */
		getNormalizedData(data) {
			const contributors = [],
				embedded = data._embedded,
				posts = embedded && embedded['doc:threads'] ? embedded['doc:threads'] : [];

			return {
				count: data.threadCount,
				forumId: data.forumId,
				contributors: DiscussionContributors.create(data._embedded.contributors),
				pivotId: (posts.length > 0 ? posts[0].id : null),
				posts: DiscussionPosts.getNormalizedData(posts)
			}
		}
	}
);

DiscussionForum.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} [sortBy='trending']
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy = 'trending') {
		const forumInstance = DiscussionForum.create({
				wikiId,
				forumId
			}),
			requestData = {
				viewableOnly: false,
			};

		if (sortBy) {
			requestData.sortKey = forumInstance.getSortKey(sortBy);
		}

		return ajaxCall({
			context: forumInstance,
			data: requestData,
			url: M.getDiscussionServiceUrl(`/${wikiId}/forums/${forumId}`),
			success: (data) => {
				forumInstance.setProperties(
					forumInstance.getNormalizedData(data)
				);
			},
			error: (err) => {
				forumInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionForum;
