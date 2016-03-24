import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './objects/contributors';
import DiscussionEntities from './objects/entities';
import DiscussionPost from './objects/post';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{
		pivotId: null,

		/**
		 * @param {number} pageNum
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0, sortBy = 'trending') {
			this.set('data.pageNum', pageNum);

			return ajaxCall({
				data: {
					page: this.get('data.pageNum'),
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				},
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
				success: (data) => {
					const newThreads = data._embedded['doc:threads'];
					let allPosts;

					allPosts = this.get('data.entities').concat(
						newThreads.map((newThread) => DiscussionPost.createFromThreadListData(newThread))
					);

					this.set('data.entities', allPosts);
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
				success: (thread) => {
					const newPost = DiscussionPost.createFromThreadData(thread);

					let allPosts;

					newPost.isNew = true;
					allPosts = this.get('data.entities');
					allPosts.insertAt(0, newPost);
					this.incrementProperty('totalPosts');
					this.set('data.entities', allPosts);
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		},

		/**
		 * @param {object} apiData
		 *
		 * @returns {void}
		 */
		setNormalizedData(apiData) {
			const embedded = apiData._embedded,
				posts = embedded && embedded['doc:threads'] ? embedded['doc:threads'] : [],
				pivotId = (posts.length > 0 ? posts[0].id : null),
				normalizedData = Ember.Object.create({
					forumId: apiData.id,
					contributors: DiscussionContributors.create(embedded.contributors[0]),
					entities: DiscussionEntities.createFromThreadsData(posts),
					pageNum: 0,
					postCount: apiData.threadCount,
				});

			this.setProperties({
				pivotId,
				data: normalizedData
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
				limit: 10,
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
				forumInstance.setNormalizedData(data);
			},
			error: (err) => {
				forumInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionForumModel;
