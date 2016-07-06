import DiscussionReportedFilterMixin from '../mixins/discussion-reported-filter';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(DiscussionReportedFilterMixin, {
	tagName: 'fieldset',
	classNames: ['discussion-fieldset', 'moderation-fieldset', 'discussions-collapsable'],
	classNameBindings: ['collapsed'],
	collapsed: false,

	actions: {
		/**
		 * Toggle categories section
		 *
		 * @returns {void}
		 */
		toggle() {
			const collapsed = this.get('collapsed');

			this.set('collapsed', !collapsed);
			track(collapsed ? trackActions.ReportedFilterUncollaped : trackActions.ReportedFilterCollaped);
		},
	}
});
