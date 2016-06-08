import Ember from 'ember';
import DiscussionWrapperComponentMixin from '../mixins/discussion-wrapper-component';
import ResponsiveMixin from '../mixins/responsive';

export default Ember.Component.extend(
	DiscussionWrapperComponentMixin,
	ResponsiveMixin
);
