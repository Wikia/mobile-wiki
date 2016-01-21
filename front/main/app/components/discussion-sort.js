import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix'],
	classNameBindings: ['sortVisible::mobile-hidden'],
	tagName: 'ul',

	discussionSort: Ember.inject.service(),

	// Whether the component is currently visible
	sortVisible: Ember.computed.oneWay('discussionSort.sortVisible'),
});
