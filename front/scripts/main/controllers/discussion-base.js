import App from '../app';

export default App.DiscussionBaseController = Ember.Controller.extend({

	isEditorOpen: false,

	/**
	 * Renders a message to display to an anon
	 */
	rejectAnon() {
		this.openDialog('editor.post-error-anon-cant-post');
	},

	/**
	 * Renders a message to display to a blocked user
	 */
	rejectBlockedUser() {
		this.openDialog('editor.post-error-not-authorized');
	},

	/**
	 * Opens a browser alert with translated message
	 * @param {string} message
	 */
	openDialog(message) {
		alert(i18n.t(message, {ns: 'discussion'}));
	},

	/**
	 * Opens post / reply editor
	 */
	setEditorOpen() {
		const isAnon = !this.get('currentUser.isAuthenticated'),
			isUserBlocked = this.get('model.isRequesterBlocked');

		if (this.get('isEditorOpen') === true) {
			return;
		}

		if (isAnon) {
			this.rejectAnon();
		} else if (isUserBlocked) {
			this.rejectBlockedUser();
		} else {
			this.set('isEditorOpen', true);
		}
	},

	/**
	 * Closes post / reply editor
	 */
	setEditorClosed() {
		if (this.get('isEditorOpen') === true) {
			this.set('isEditorOpen', false);
		}
	},

	actions: {
		/**
		 * @param active
		 */
		toggleEditor(active) {
			if (active === true) {
				this.setEditorOpen();
			} else {
				this.setEditorClosed();
			}
		}
	}
});
