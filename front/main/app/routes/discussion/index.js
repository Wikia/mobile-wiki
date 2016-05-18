import Ember from 'ember';

export default Ember.Route.extend({
	discussionSort: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('discussion.forum', {queryParams: {sort: this.get('discussionSort.sortBy')}});
	},
});
