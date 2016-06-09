import Ember from 'ember';

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
			// TODO change sorting

			this.get('model').createPost(entityData).finally(() => {
				this.set('isEditorLoading', false);
			});
			// TODO error handling
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			this.set('isEditorLoading', true);

			this.get('model').editPost(entityData).finally(() => {
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

			this.get('model').createReply(entityData).finally(() => {
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

			this.get('model').editReply(entityData).finally(() => {
				this.set('isEditorLoading', false);
			});
		},

		generateOpenGraph(uri) {
			this.get('target').send('generateOpenGraph', uri);
		}
	}
});
