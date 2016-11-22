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
			const requestUrl = M.getDiscussionServiceUrl(`/${this.wikiId}/threads/followed-by/${user.get('userId')}`);
			return this.loadThreadPage(requestUrl);
		},
	}
);

DiscussionFollowedPostsModel.reopenClass(
	DiscussionForumModelStaticMixin,
	{
		/**
		 * @param {number} wikiId
		 * @param {object} user
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, user) {
			const followedPostsInstance = DiscussionFollowedPostsModel.create({
					wikiId
				}),
				requestUrl = M.getDiscussionServiceUrl(`/${wikiId}/threads/followed-by/${user.get('userId')}`);

			return this.findThreads(followedPostsInstance, requestUrl);
		}
	}
);

export default DiscussionFollowedPostsModel;
