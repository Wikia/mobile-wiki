import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-sort', 'clearfix', 'mobile-hidden'],
	classNameBindings: ['noTrending'],
	discussionSort: Ember.inject.service(),
	tagName: 'ul',

	noTrending: Ember.computed.oneWay('discussionSort.onlyReported'),
});
