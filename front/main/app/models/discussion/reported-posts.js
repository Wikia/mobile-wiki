import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributors from './objects/contributors';
import DiscussionEntities from './objects/entities';

const DiscussionReportedPosts = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{
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

					DiscussionEntities.createFromPostsData(newPosts);

					this.set('data.entities', this.get('data.entities').concat(newPosts));
				},
				error: (err) => {
					this.handleLoadMoreError(err);
				}
			});
		},

		setNormalizedData(apiData) {
			const embedded = apiData._embedded,
				posts = embedded && embedded['doc:posts'] ? embedded['doc:posts'] : [],
				pivotId = (posts.length > 0 ? posts[0].id : null),
				normalizedData = Ember.Object.create({
					forumId: Ember.get(Mercury, 'wiki.id'),
					contributors: DiscussionContributors.create(embedded.contributors[0]),
					entities: DiscussionEntities.createFromPostsData(posts),
					pageNum: 0,
					postCount: apiData.postCount,
				});

			this.setProperties({
				pivotId,
				data: normalizedData
			});
		}
	}
);

DiscussionReportedPosts.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} [sortBy='trending']
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy = 'trending') {
		const reportedPostsInstance = DiscussionReportedPosts.create({
				wikiId,
				forumId
			}),
			requestData = {
				viewableOnly: false,
				reported: true
			};

		if (sortBy) {
			requestData.sortKey = reportedPostsInstance.getSortKey(sortBy);
		}

		return ajaxCall({
			context: reportedPostsInstance,
			data: requestData,
			url: M.getDiscussionServiceUrl(`/${wikiId}/posts`),
			success: (data) => {
				reportedPostsInstance.setNormalizedData(data);
			},
			error: (err) => {
				reportedPostsInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionReportedPosts;
