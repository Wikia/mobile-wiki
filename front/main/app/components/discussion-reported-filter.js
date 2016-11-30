import DiscussionReportedFilterMixin from '../mixins/discussion-reported-filter';
import DiscussionCollapsableMixin from '../mixins/discussion-collapsable';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionReportedFilterMixin,
	DiscussionCollapsableMixin,
	{
		classNameBindings: ['topDecoration:moderation-filter-top-decoration'],

		onCollapseChanged(collapsed) {
			track(collapsed ? trackActions.ReportedFilterUncollapsed : trackActions.ReportedFilterCollapsed);
		},
	}
);
