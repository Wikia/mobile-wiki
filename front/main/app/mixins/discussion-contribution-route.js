import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
export default Ember.Mixin.create({
	discussionEditor: Ember.inject.service(),
	discussionEditEditor: Ember.inject.service(),
	/**
	 * @param {error} err
	 * @param {boolean} isEdit
	 *
	 * @returns {void}
	 */
	onContributionError(err, isEdit) {
		if (isUnauthorizedError(err.status)) {
			this.setEditorError('editor.post-error-not-authorized', isEdit);
		} else {
			this.setEditorError('editor.post-error-general-error', isEdit);
		}
	},

	/**
	 * @param {string} errorMessage
	 * @param {boolean} isEdit
	 *
	 * @returns {void}
	 */
	setEditorError(errorMessage, isEdit) {
		this.get(isEdit ? 'discussionEditEditor' : 'discussionEditor').setErrorMessage(errorMessage);
	},

	actions: {
		/**
		 * Upvote discussion entity
		 *
		 * @param {object} entity
		 *
		 * @returns {void}
		 */
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
			this.setEditorError(null, false);

			this.setSortBy('latest').promise.then(() => {
				const model = this.modelFor(this.get('routeName'));

				model.createPost(postData).then(() => {
					this.get('discussionEditor').trigger('newPost');
				}).catch((err) => {
					this.onContributionError(err, false);
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

			this.setEditorError(null, true);

			model.editPost(postData).then(() => {
				this.get('discussionEditEditor').trigger('newPost');
			}).catch((err) => {
				this.onContributionError(err, true);
			}).finally(() => {
				this.get('discussionEditEditor').set('isLoading', false);
			});
		},

		/**
		 * Triggers new reply creation on a model
		 * @param {object} replyData
		 * @returns {void}
		 */
		createReply(replyData) {
			this.setEditorError(null, false);

			this.modelFor(this.get('routeName')).createReply(replyData).catch((err) => {
				this.onContributionError(err, false);
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

			this.setEditorError(null, true);

			model.editReply(replyData).then(() => {
				this.get('discussionEditEditor').trigger('newPost');
			}).catch((err) => {
				this.onContributionError(err, true);
			}).finally(() => {
				this.get('discussionEditEditor').set('isLoading', false);
			});
		},

		generateOpenGraph(uri) {
			const model = this.modelFor(this.get('routeName'));

			model.generateOpenGraph(uri).then((openGraph) => {
				// TODO do something with the data
				console.log(openGraph);
			})
		}
	}
});
