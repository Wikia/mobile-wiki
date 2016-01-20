export default Ember.Service.extend({
	isAnon: true,
	isEditorOpen: false,
	isUserBlocked: false,

	modalDialogService: Ember.inject.service('modal-dialog'),

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
		this.get('modalDialogService').display(message);
	},

	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		if (this.get('isEditorOpen') === true) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
		} else if (this.get('isUserBlocked')) {
			this.rejectBlockedUser();
		} else {
			this.set('isEditorOpen', true);
		}
	},

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		if (active === true) {
			this.activateEditor();
		} else {
			this.set('isEditorOpen', false);
		}
	},
});
