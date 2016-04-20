import Ember from 'ember';

export default Ember.Route.extend({
	discussionSort: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('discussion.forum', Mercury.wiki.id, this.get('discussionSort.sortBy'));
	},
});
