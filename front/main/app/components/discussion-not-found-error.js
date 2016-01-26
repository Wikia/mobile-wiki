import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-error', 'columns', 'large-6'],
	discussionSort: Ember.inject.service(),
});
