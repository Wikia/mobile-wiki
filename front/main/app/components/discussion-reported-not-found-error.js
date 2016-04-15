import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-error'],
	discussionSort: Ember.inject.service(),
});
