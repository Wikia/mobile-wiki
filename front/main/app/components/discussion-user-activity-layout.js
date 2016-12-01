import Ember from 'ember';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	ResponsiveMixin,
	{
		classNames: ['discussion-user-activity-layout']
	}
);
