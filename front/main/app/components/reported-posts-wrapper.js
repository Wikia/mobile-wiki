import Ember from 'ember';
import DiscussionWrapperComponentMixin from '../mixins/discussion-wrapper-component';

export default Ember.Component.extend(
	DiscussionWrapperComponentMixin,
	{
		classNames: ['discussion-reported-posts'],
	}
);
