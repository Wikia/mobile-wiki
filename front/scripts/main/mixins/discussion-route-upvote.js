import App from '../app';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default App.DiscussionRouteUpvoteMixin = Ember.Mixin.create({
	upvotingInProgress: {},

	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const postId = Ember.get(post, 'id'),
				hasUpvoted = Ember.get(post._embedded.userData[0], 'hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			if (this.upvotingInProgress[postId] || typeof Ember.get(post, '_embedded.userData') === 'undefined') {
				return null;
			}

			this.upvotingInProgress[postId] = true;

			// the change in the front-end is done here
			Ember.set(post._embedded.userData[0], 'hasUpvoted', !hasUpvoted);

			Ember.$.ajax({
				method,
				url: M.getDiscussionServiceUrl(`/${Ember.get(post, 'siteId')}/votes/post/${Ember.get(post, 'id')}`),
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data) => {
					Ember.set(post, 'upvoteCount', data.upvoteCount);
				},
				error: () => {
					Ember.set(post._embedded.userData[0], 'hasUpvoted', hasUpvoted);
				},
				complete: () => {
					this.upvotingInProgress[postId] = false;
				}
			});
		}
	}
});
