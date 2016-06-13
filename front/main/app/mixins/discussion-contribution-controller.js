import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';

export default Ember.Mixin.create({
	isEditorLoading: false,

	/**
	 * @param {error} err
	 * @param {string} generalErrorKey
	 * @param {boolean} isEdit
	 *
	 * @returns {void}
	 */
	onContributionError(err, generalErrorKey) {
		if (isUnauthorizedError(err.status)) {
			this.setEditorError('editor.post-error-not-authorized');
		} else {
			this.setEditorError(generalErrorKey);
		}
	},

	/**
	 * @param {string} errorMessage
	 * @param {boolean} isEdit
	 *
	 * @returns {void}
	 */
	setEditorError(errorMessage) {
		this.set('editorErrorMessage', errorMessage);

		if (errorMessage) {
			Ember.run.later(this, () => {
				this.set('editorErrorMessage', null);
			}, 3000);
		}
	},

	actions: {
		/**
		 * Upvote discussion entity
		 *
		 * @param {object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('model').upvote(post);
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		createPost(entityData) {
			this.set('isEditorLoading', true);
			this.setEditorError(null);
			// TODO change sorting

			this.get('model').createPost(entityData).catch((err) => {
				this.onContributionError(err, 'editor.post-error-general-error');
			}).finally(() => {
				this.set('isEditorLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			this.set('isEditorLoading', true);
			this.setEditorError(null);

			this.get('model').editPost(entityData).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error');
			}).finally(() => {
				this.set('isEditorLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			this.set('isEditorLoading', true);
			this.setEditorError(null);

			this.get('model').createReply(entityData).catch((err) => {
				this.onContributionError(err, 'editor.reply-error-general-error');
			}).finally(() => {
				this.set('isEditorLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			this.set('isEditorLoading', true);
			this.setEditorError(null);

			this.get('model').editReply(entityData).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error');
			}).finally(() => {
				this.set('isEditorLoading', false);
			});
		},
	}
});
