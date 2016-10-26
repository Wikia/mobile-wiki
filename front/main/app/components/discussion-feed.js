import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		canShowReportedPostsFilter: Ember.computed('isFollowedPostsView', 'model.canModerate', function () {
			return !this.get('isFollowedPostsView') && this.get('model.canModerate');
		}),

	}
);
