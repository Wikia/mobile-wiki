import DiscussionModerationControllerMixin from '../../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../../mixins/discussion-contribution-controller';
import ResponsiveMixin from '../../../mixins/responsive';
import DiscussionBaseController from '../base';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	ResponsiveMixin,
	{
		options: {
			posts: {
				isActive: false,
			}
		},

		parentController: Ember.inject.controller('discussion.moderator.user-activity'),

		actions: {
			setDays(days) {
				this.get('target').send('setDays', days);
			}
		}
	}
);
