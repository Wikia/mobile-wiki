import Ember from 'ember';
import {isUnauthorizedError} from 'ember-ajax/errors';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	currentUser: Ember.inject.service(),
	modalDialog: Ember.inject.service(),
	discussion: Ember.inject.controller(),


	isAnon: Ember.computed.not('currentUser.isAuthenticated'),
	isUserBlocked: false,

	editorState: null,
	editEditorState: null,
	guidelinesEditorState: null,

	setEditorState: Ember.on('init', function () {
		this.set('editorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
		}));

		this.set('editEditorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
			discussionEntity: null,
		}));

		this.set('guidelinesEditorState', Ember.Object.create({
			errorMessage: null,
			isLoading: false,
			isOpen: false,
			guidelines: null,
		}));
	}),

	/**
	 * Get object that contains editor state
	 *
	 * @param {string} editorType type of editor - available 'contributeEditor', 'editEditor' and 'guidelinesEditor'
	 *
	 * @returns {object}
	 */
	getEditorState(editorType) {
		if (editorType === 'contributeEditor') {
			return this.get('editorState');
		} else if (editorType === 'editEditor') {
			return this.get('editEditorState');
		} else if (editorType === 'guidelinesEditor') {
			return this.get('guidelinesEditorState');
		} else {
			throw new Error(`Editor type not supported: ${editorType}`);
		}
	},

	/**
	 * Set editor active state
	 *
	 * @param {string} editorType editor type, available types see: getEditorState
	 *
	 * @returns {void}
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

	createPost(entityData) {
		const editorType = 'contributeEditor',
			editorState = this.getEditorState(editorType);

		editorState.set('isLoading', true);
		this.setEditorError(editorType, null);

		this.get('model').current.createPost(entityData).catch((err) => {
			this.onContributionError(editorType, err, 'editor.post-error-general-error');
		}).finally(() => {
			editorState.set('isLoading', false);
		});
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
					discussionEntity: null,
					guidelines: null,
				});
			}
		},

		/**
		 * Sets discussion entity for editor
		 *
		 * @param {DiscussionEntity} discussionEntity
		 *
		 * @returns {void}
		 */
		openEditEditor(discussionEntity) {
			this.send('setEditorActive', 'editEditor', true);
			Ember.run.scheduleOnce('afterRender', this, function () {
				// set editor content after render so textarea autoresize can correctly calculate height
				this.set('editEditorState.discussionEntity', discussionEntity);
			});
		},

		/**
		 * Sets discussion entity for editor
		 *
		 * @param {DiscussionSiteAttribute} guidelines
		 *
		 * @returns {void}
		 */
		openGuidelinesEditor(guidelines) {
			this.send('setEditorActive', 'guidelinesEditor', true);
			Ember.run.scheduleOnce('afterRender', this, function () {
				// set editor content after render so textarea autoresize can correctly calculate height
				this.set('guidelinesEditorState.guidelines', guidelines);
			});
		},

		/**
		 * Upvote discussion entity
		 *
		 * @param {Object} post
		 * @returns {void}
		 */
		upvote(post) {
			this.get('model').current.upvote(post);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createPost(entityData) {
			this.createPost(entityData);
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		editPost(entityData) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.editPost(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		createReply(entityData) {
			const editorType = 'contributeEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.createReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.reply-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * Bubbles up to Route
		 * @param {Object} entityData
		 * @returns {void}
		 */
		editReply(entityData) {
			const editorType = 'editEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('model').current.editReply(entityData).catch((err) => {
				this.onContributionError(editorType, err, 'editor.save-error-general-error');
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},

		/**
		 * This saves the new Guidelines.
		 * @param {Object} text
		 * @returns {void}
		 */
		saveGuidelines(text) {
			const editorType = 'guidelinesEditor',
				editorState = this.getEditorState(editorType);

			editorState.set('isLoading', true);
			this.setEditorError(editorType, null);

			this.get('discussion.model').attributes.saveAttribute('guidelines', text).then(() => {
				track(trackActions.GuidelinesEditSave);
			}).catch((err) => {
				this.onContributionError(err, 'editor.save-error-general-error', true);
			}).finally(() => {
				editorState.set('isLoading', false);
			});
		},
	}
});
