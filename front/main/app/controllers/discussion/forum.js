import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import DiscussionIntroducingFollowingMixin from '../../mixins/discussion-introducing-following';
import ResponsiveMixin from '../../mixins/responsive';
import DiscussionBaseController from './base';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	DiscussionIntroducingFollowingMixin,
	ResponsiveMixin,
	{
		areGuidelinesVisible: false,
		catId: null,
		queryParams: ['sort', 'catId'],

		actions: {
			updateCategoriesSelection(categories) {
				this.get('target').send('updateCategoriesSelection', categories);
			},

			createPost(entityData, forumId) {
				this.hideShareTooltip();

				this.transitionToRoute({queryParams: {sort: 'latest'}}).promise.then(() => {
					this.createPost(entityData, forumId);
				});
			}
		}
	}
);
