import Ember from 'ember';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';

export default Ember.Controller.extend(
	DiscussionModerationControllerMixin,
	DiscussionUpvoteControllerMixin,
	DiscussionForumActionsControllerMixin,
	{
		application: Ember.inject.controller(),

		smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
		siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),
	}
);
