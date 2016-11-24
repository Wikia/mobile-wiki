import DiscussionCollapsableMixin from '../mixins/discussion-collapsable';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend(
	DiscussionCollapsableMixin,
	{
		classNameBindings: ['topDecoration:moderation-filter-top-decoration'],
		classNames: ['discussion-user-activity-glossary'],

		onCollapseChanged(collapsed) {
		},
	}
);
