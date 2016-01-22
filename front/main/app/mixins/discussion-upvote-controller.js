import Ember from 'ember';

export default Ember.Mixin.create({
	actions: {
		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('target').send('upvote', post);
		}
	}
});
