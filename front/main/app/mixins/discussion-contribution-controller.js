import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';

export default Ember.Mixin.create({
	currentUser: Ember.inject.service(),
	modalDialog: Ember.inject.service(),

	isAnon: Ember.computed.not('currentUser.isAuthenticated'),
	isUserBlocked: false,

	editorState: Ember.Object.create({
		errorMessage: null,
		isLoading: false,
		isOpen: false,
	}),

	editEditorState: Ember.Object.create({
		errorMessage: null,
		isLoading: false,
		isOpen: false,
	}),

	activateEditor() {
		if (this.get('editorState.isOpen')) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
			return;
		} else if (this.get('isUserBlocked')) {
			this.rejectBlockedUser();
			return;
		}

		this.get('editorState').setProperties({
			errorMessage: null,
			isOpen: true,
		});
	},

	/**
	 * Renders a message to display to an anon
	 * @returns {void}
	 */
	rejectAnon() {
		this.openDialog('editor.post-error-anon-cant-post');
	},

	/**
	 * Renders a message to display to a blocked user
	 * @returns {void}
	 */
	rejectBlockedUser() {
		this.openDialog('editor.post-error-not-authorized');
	},

	/**
	 * Opens a modal dialog with translated message
	 * @param {string} message
	 * @returns {void}
	 */
	openDialog(message) {
		this.get('modalDialog').display(i18n.t(message, {ns: 'discussion'}));
	},

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
		this.set('editorState.errorMessage', errorMessage);

		if (errorMessage) {
			Ember.run.later(this, () => {
				this.set('editorState.errorMessage', null);
			}, 3000);
		}
	},

	actions: {
		setEditorActive(active) {
			if (active === true) {
				this.activateEditor();
			} else {
				this.get('editorState').setProperties({
					errorMessage: null,
					isOpen: false,
				});
			}
		},

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
			this.set('editorState.isLoading', true);
			this.setEditorError(null);
			// TODO change sorting

			this.get('model').createPost(entityData).catch((err) => {
				this.onContributionError(err, 'editor.post-error-general-error');
			}).finally(() => {
				this.set('editorState.isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			this.set('editorState.isLoading', true);
			this.setEditorError(null);

			this.get('model').editPost(entityData).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error');
			}).finally(() => {
				this.set('editorState.isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			this.set('editorState.isLoading', true);
			this.setEditorError(null);

			this.get('model').createReply(entityData).catch((err) => {
				this.onContributionError(err, 'editor.reply-error-general-error');
			}).finally(() => {
				this.set('editorState.isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			this.set('editorState.isLoading', true);
			this.setEditorError(null);

			this.get('model').editReply(entityData).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error');
			}).finally(() => {
				this.set('editorState.isLoading', false);
			});
		},
	}
});
