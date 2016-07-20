import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
	isAnon: true,
	isEditorOpen: false,
	isUserBlocked: false,
	errorMessage: null,

	modalDialog: Ember.inject.service(),

	isLoading: false,

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
		this.set('errorMessage', message);
	},

	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		if (this.get('isEditorOpen')) {
			return;
		}

		if (this.get('isAnon')) {
			this.rejectAnon();
			return;
		} else if (this.get('isUserBlocked')) {
			this.rejectBlockedUser();
			return;
		}

		this.setProperties({
			isEditorOpen: true,
			errorMessage: null
		});
	},

	/**
	 * @param {boolean} active
	 * @returns {void}
	 */
	toggleEditor(active) {
		if (active === true) {
			this.activateEditor();
		} else {
			this.setProperties({
				errorMessage: null,
				isEditorOpen: false
			});
		}
	},
});
