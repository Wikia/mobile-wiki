import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		currentUser: Ember.inject.service(),
		canUseModeratorTools: Ember.computed.bool('currentUser.permissions.discussions.canUseModeratorTools'),
		classNames: ['discussion-moderator-tools'],

		actions: {
			trackReportedContentTap() {
				track(trackActions.ReportedPostsLinkTapped);
			},

			trackUserActivityTap() {
				track(trackActions.UserActivityLinkTapped);
			}
		}
	}
);

