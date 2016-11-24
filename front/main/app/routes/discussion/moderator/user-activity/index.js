import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	model() {
		this.transitionTo('discussion.moderator.user-activity.posts');
	}
});
