import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix', 'mobile-hidden'],
	tagName: 'ul',

	discussionSort: Ember.inject.service()
});
