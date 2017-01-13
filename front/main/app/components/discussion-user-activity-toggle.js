import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-user-activity-toggle'],

		isPostsActive: Ember.computed.match('currentRouteName', /posts$/),
		isReportsActive: Ember.computed.match('currentRouteName', /reports$/),
		isModerationsActive: Ember.computed.match('currentRouteName', /moderations$/),

		actions: {
			trackUserActivityActiveUsersTabTap() {
				track(trackActions.UserActivityActiveUsersTabTapped);
			},

			trackUserActivityReportsTabTap() {
				track(trackActions.UserActivityReportsTabTapped);
			},

			trackUserActivityModeratorActionsTabTap() {
				track(trackActions.UserActivityModeratorActionsTabTapped);
			},
		}
	}
);
