import Ember from 'ember';
import DiscussionBaseRoute from '../../base';

export default DiscussionBaseRoute.extend({
	/**
	 * @returns {void}
	 */
	model() {
		this.transitionTo('discussion.moderator.user-activity.posts');
	}
});
