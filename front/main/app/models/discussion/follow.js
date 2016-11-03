import Ember from 'ember';
import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../../mixins/discussion-forum-actions-model';
import DiscussionForumModelMixin from '../../mixins/discussion-forum-model';
import DiscussionForumModelStaticMixin from '../../mixins/discussion-forum-model-static';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';

const DiscussionFollowedPostsModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	DiscussionForumModelMixin,
	DiscussionContributionModelMixin,
	{
		/**
		 * @param {object} user
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(user) {
			// fixme URL after backend ready
			const requestUrl = M.getDiscussionServiceUrl(`/${this.wikiId}/threads`),
				requestData = {
					userId: user.get('userId'),
					limit: this.get('loadMoreLimit'),
					page: this.get('data.pageNum') + 1,
					pivot: this.get('pivotId'),
					viewableOnly: false
				};
			return this.loadThreadPage(requestUrl, requestData);
		},
	}
);

DiscussionFollowedPostsModel.reopenClass(
	DiscussionForumModelStaticMixin,
	{
		/**
		 * @param {number} wikiId
		 * @param {object} user
		 * @param {number} page
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, user, page = 1, zero) {
			//TODO zero variable is just for design review, remove it before release
			const followedPostsInstance = DiscussionFollowedPostsModel.create({
					wikiId
				}),
				// fixme URL after backend ready
				requestUrl = M.getDiscussionServiceUrl(`/${wikiId}/threads`),
				requestData = {
					userId: user.get('userId'),
					page: page - 1,
					limit: followedPostsInstance.get('postsLimit'),
					viewableOnly: false
				};
			followedPostsInstance.setStartPageNumber(page);

			return this.findThreads(followedPostsInstance, requestUrl, requestData, zero);
		}
	}
);

export default DiscussionFollowedPostsModel;
