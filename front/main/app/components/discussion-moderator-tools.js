import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-moderator-tools'],

		actions: {
			openReportedContent() {
				track(trackActions.ReportedPostsLinkTapped);
			},

			openUserActivity() {
				track(trackActions.UserActivityLinkTapped);
			}
		}
	}
);

