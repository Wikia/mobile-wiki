import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
	isAnon: true,
	isEditorOpen: false,
	isEditEditorOpen: false,
	isUserBlocked: false,
	discussionEntity: null,
	errorMessage: null,
	editErrorMessage: null,

	modalDialog: Ember.inject.service(),

	isEditMode: Ember.computed('discussionEntity', function () {
		return this.get('discussionEntity') !== null;
	}),

	shouldStopLoading: false,

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

	setErrorMessage(message) {
		this.set('shouldStopLoading', true);

		if (this.get('isEditMode')) {
			this.set('editErrorMessage', message);
		} else {
			this.set('errorMessage', message);
		}
	},

	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		if (
			(!this.get('isEditMode') && this.get('isEditorOpen') === true) &&
			(this.get('isEditMode') && this.get('isEditEditorOpen') === true)
		) {
			return;
		}

		if (this.get('isAnon')) {
			return this.rejectAnon();
		} else if (this.get('isUserBlocked')) {
			return this.rejectBlockedUser();
		} else if (this.get('isEditMode')) {
			this.set('isEditEditorOpen', true);
		} else {
			this.set('isEditorOpen', true);
		}
		this.set('errorMessage', null);
		this.set('editErrorMessage', null);
	},

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		if (active === true) {
			this.activateEditor();
		} else {
			this.set('errorMessage', null);
			this.set('editErrorMessage', null);
			this.set('discussionEntity', null);
			this.set('isEditorOpen', false);
			this.set('isEditEditorOpen', false);
		}
	},

	setDiscussionEntity(discussionEntity) {
		this.set('discussionEntity', discussionEntity);
	}
});
