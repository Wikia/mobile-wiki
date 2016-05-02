import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	/**
	 * @param {error} err
	 *
	 * @returns {void}
	 */
	onContributionError(err) {
		if (isUnauthorizedError(err.status)) {
			this.setEditorError('editor.post-error-not-authorized');
		} else {
			this.setEditorError('editor.post-error-general-error');
		}
	},

	/**
	 * @param {string} errorMessage
	 *
	 * @returns {void}
	 */
	setEditorError(errorMessage) {
		this.get('discussionEditor').setErrorMessage(errorMessage);
	},

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
			this.setEditorError(null);

			this.setSortBy('latest').promise.then(() => {
				const model = this.modelFor(this.get('routeName'));

				model.createPost(postData).then((data) => {
					if (data && !model.get('errorMessage')) {
						this.get('discussionEditor').trigger('newPost');
					}
				}).catch((err) => {
					this.onContributionError(err);
				}).finally(() => {
					this.get('discussionEditor').set('isLoading', false);
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

			this.setEditorError(null);

			model.editPost(postData).then((data) => {
				if (data && !model.get('errorMessage')) {
					this.get('discussionEditor').trigger('newPost');
				}
			}).catch((err) => {
				this.onContributionError(err);
			}).finally(() => {
				this.get('discussionEditor').set('isLoading', false);
			});
		},

		/**
		 * Triggers new reply creation on a model
		 * @param {object} replyData
		 * @returns {void}
		 */
		createReply(replyData) {
			this.setEditorError(null);

			this.modelFor(this.get('routeName')).createReply(replyData).catch((err) => {
				this.onContributionError(err);
			}).finally(() => {
				this.get('discussionEditor').set('isLoading', false);
			});
		},

		/**
		 * Triggers reply edit on a model
		 * @param {object} replyData
		 * @returns {void}
		 */
		editReply(replyData) {
			const model = this.modelFor(this.get('routeName'));

			this.setEditorError(null);

			model.editReply(replyData).then((data) => {
				if (data && !model.get('errorMessage')) {
					this.get('discussionEditor').trigger('newPost');
				}
			}).catch((err) => {
				this.onContributionError(err);
			}).finally(() => {
				this.get('discussionEditor').set('isLoading', false);
			});
		},
	}
});
