import Ember from 'ember';
import ajaxCall from '../utils/ajax-call';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	upvotingInProgress: {},

	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const postId = Ember.get(post, 'id'),
				hasUpvoted = Ember.get(post.userData, 'hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			if (this.upvotingInProgress[postId] || typeof Ember.get(post, 'userData') === 'undefined') {
				return null;
			}

			this.upvotingInProgress[postId] = true;

			// the change in the front-end is done here
			Ember.set(post.userData, 'hasUpvoted', !hasUpvoted);

			ajaxCall({
				method,
				url: M.getDiscussionServiceUrl(`/${Ember.get(Mercury, 'wiki.id')}/votes/post/${Ember.get(post, 'id')}`),
				success: (data) => {
					Ember.set(post, 'upvoteCount', data.upvoteCount);
				},
				error: () => {
					Ember.set(post.userData, 'hasUpvoted', hasUpvoted);
				},
				complete: () => {
					this.upvotingInProgress[postId] = false;
				}
			});
		}
	}
});
