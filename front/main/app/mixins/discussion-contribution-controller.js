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
		discussionEntity: null,
	}),

	/**
	 * Get object that contains editor state
	 *
	 * @param {string} editorType type of editor - available 'contributeEditor' and 'editEditor'
	 *
	 * @returns object
	 */
	getEditorState(editorType) {
		if (editorType === 'contributeEditor') {
			return this.get('editorState');
		} else if (editorType === 'editEditor') {
			return this.get('editEditorState');
		}
		else {
			throw `Editor type not supported: ${editorType}`;
		}
	},

	/**
	 * Set editor active state
	 *
	 * @param {string} editorType editor type, available types see: getEditorState
	 */
	activateEditor(editorType) {
		const editorState = this.getEditorState(editorType);

		if (editorState.get('isOpen')) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
			return;
		} else if (this.get('isUserBlocked')) {
			this.rejectBlockedUser();
			return;
		}

		editorState.setProperties({
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
	 * @param {string} editorType editor type, available types see: getEditorState
	 * @param {error} err
	 * @param {string} generalErrorKey
	 *
	 * @returns {void}
	 */
	onContributionError(editorType, err, generalErrorKey) {
		if (isUnauthorizedError(editorType, err.status)) {
			this.setEditorError('editor.post-error-not-authorized');
		} else {
			this.setEditorError(editorType, generalErrorKey);
		}
	},

	/**
	 * @param {string} editorType editor type, available types see: getEditorState
	 * @param {string} errorMessage
	 *
	 * @returns {void}
	 */
	setEditorError(editorType, errorMessage) {
		const editorState = this.getEditorState(editorType);

		editorState.set('errorMessage', errorMessage);

		if (errorMessage) {
			Ember.run.later(this, () => {
				editorState.set('errorMessage', null);
			}, 3000);
		}
	},

	actions: {
		/**
		 * Set editor active state
		 *
		 * @param {string} editorType editor type, available types see: getEditorState
		 * @param {boolean} active desired state of editor
		 *
		 * @returns {void}
		 */
		setEditorActive(editorType, active) {
			if (active === true) {
				this.activateEditor(editorType);
			} else {
				this.getEditorState(editorType).setProperties({
					errorMessage: null,
					isOpen: false,
				});
			}
		},

		/**
		 * Sets discussion entity for editor
		 *
		 * @param {DiscussionEntity} discussionEntity
		 */
		setEditDiscussionEntity(discussionEntity) {
			this.set('editEditorState.discussionEntity', discussionEntity)
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
			const editorType = 'contributeEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);
			// TODO change sorting

			this.get('model').createPost(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.post-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').editPost(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			const editorType = 'contributeEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').createReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.reply-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').editReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},
	}
});
