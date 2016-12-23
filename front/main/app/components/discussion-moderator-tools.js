import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
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

