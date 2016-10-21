import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		canShowReportedPostsFilter: Ember.computed('isFollewedPostsView', 'model.canModerate', function () {
			return !this.get('isFollewedPostsView') && this.get('model.canModerate');
		}),

	}
);
