import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		this.transitionTo('discussion.moderator.user-activity.posts');
	},
});
