/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
App.DiscussionRouteUpvoteMixin = Em.Mixin.create({
	upvotingInProgress: {},

	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const postId = Em.get(post, 'id'),
				hasUpvoted = Em.get(post._embedded.userData[0], 'hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			if (this.upvotingInProgress[postId] || typeof Em.get(post, '_embedded.userData') === 'undefined') {
				return null;
			}

			this.upvotingInProgress[postId] = true;

			// the change in the front-end is done here
			Em.set(post._embedded.userData[0], 'hasUpvoted', !hasUpvoted);

			Em.$.ajax({
				method,
				url: M.getDiscussionServiceUrl(`/${Em.get(post, 'siteId')}/votes/post/${Em.get(post, 'id')}`),
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data) => {
					Em.set(post, 'upvoteCount', data.upvoteCount);
				},
				error: () => {
					Em.set(post._embedded.userData[0], 'hasUpvoted', hasUpvoted);
				},
				complete: () => {
					this.upvotingInProgress[postId] = false;
				}
			});
		}
	}
});
