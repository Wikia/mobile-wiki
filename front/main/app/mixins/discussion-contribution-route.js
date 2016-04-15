import Ember from 'ember';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	actions: {
		upvote(entity) {
			this.modelFor(this.get('routeName')).upvote(entity);
		},

		/**
		 * Applies sorting by date and attempts to create a new post
		 *
		 * @param {object} postData
		 *
		 * @returns {void}
		 */
		createPost(postData) {
			this.setSortBy('latest').promise.then(() => {
				const model = this.modelFor(this.get('routeName'));

				model.createPost(postData).then((xhr) => {
					if (xhr.apiResponseData && !model.get('errorMessage')) {
						this.get('discussionEditor').trigger('newPost');
					}
				});
			});
		},

		/**
		 * Attempt to edit a new post
		 *
		 * @param {object} postData
		 *
		 * @returns {void}
		 */
		editPost(postData) {
			const model = this.modelFor(this.get('routeName'));

			model.editPost(postData).then((xhr) => {
				if (xhr.apiResponseData && !model.get('errorMessage')) {
					this.get('discussionEditor').trigger('newPost');
				}
			});
		},

		/**
		 * Triggers new reply creation on a model
		 * @param {object} replyData
		 * @returns {void}
		 */
		createReply(replyData) {
			this.modelFor(this.get('routeName')).createReply(replyData);
		},

		/**
		 * Triggers reply edit on a model
		 * @param {object} replyData
		 * @returns {void}
		 */
		editReply(replyData) {
			this.modelFor(this.get('routeName')).editReply(replyData);
		},
	}
});
