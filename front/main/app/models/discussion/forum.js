import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionForumModelMixin from '../../mixins/discussion-forum-model';
import DiscussionForumModelStaticMixin from '../../mixins/discussion-forum-model-static';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	DiscussionForumModelMixin,
	DiscussionContributionModelMixin,
	{
		/**
		 * @param {number} [pageNum=0]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(page = 1, categories = [], sortBy = 'trending') {
			const requestUrl = M.getDiscussionServiceUrl(`/${this.wikiId}/threads`),
				requestData = {
					forumId: categories,
					limit: this.get('loadMoreLimit'),
					page: this.get('data.pageNum') + 1,
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				};

			return this.loadThreadPage(requestUrl, requestData);
		},
	}
);

DiscussionForumModel.reopenClass(
	DiscussionForumModelStaticMixin,
	{
		/**
		 * @param {number} wikiId
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, categories = [], sortBy = 'trending', page = 1) {
			const forumInstance = DiscussionForumModel.create({
					wikiId
				}),
				requestUrl = M.getDiscussionServiceUrl(`/${wikiId}/threads`),
				requestData = {
					page: page - 1,
					forumId: categories instanceof Array ? categories : [categories],
					limit: forumInstance.get('postsLimit'),
					viewableOnly: false
				};

			if (sortBy) {
				requestData.sortKey = forumInstance.getSortKey(sortBy);
			}

			return this.findThreads(forumInstance, requestUrl, requestData);
		},
	}
);

export default DiscussionForumModel;
