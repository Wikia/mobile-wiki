import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-user-activity-toggle'],

		isPostsActive: Ember.computed.match('currentRouteName', /posts$/),
		isReportsActive: Ember.computed.match('currentRouteName', /reports$/),
		isModerationsActive: Ember.computed.match('currentRouteName', /moderations$/),
	}
);
