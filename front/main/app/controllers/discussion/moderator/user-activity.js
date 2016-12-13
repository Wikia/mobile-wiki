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

		days: null,

		queryParams: ['days'],

		parentController: Ember.inject.controller('discussion.moderator.user-activity'),

		applicationController: Ember.inject.controller('application'),

		currentRouteName: Ember.computed.alias('applicationController.currentRouteName'),

		actions: {
			setDays(days) {
				this.get('target').send('setDays', days);
			}
		}
	}
);
