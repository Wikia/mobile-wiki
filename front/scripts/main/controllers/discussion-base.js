import App from '../app';
import DiscussionDeleteControllerMixin from '../mixins/discussion-delete-controller';

export default App.DiscussionBaseController = Ember.Controller.extend(DiscussionDeleteControllerMixin, {

	isEditorOpen: false,

	/**
	 * Renders a message to display to an anon
	 * @returns {void}
	 */
	rejectAnon() {
		Ember.$('.editor-textarea').blur();
		this.openDialog('editor.post-error-anon-cant-post');
	},

	/**
	 * Renders a message to display to a blocked user
	 * @returns {void}
	 */
	rejectBlockedUser() {
		Ember.$('.editor-textarea').blur();
		this.openDialog('editor.post-error-not-authorized');
	},

	/**
	 * Opens a browser alert with translated message
	 * @param {string} message
	 * @returns {void}
	 */
	openDialog(message) {
		alert(i18n.t(message, {ns: 'discussion'}));
	},

	/**
	 * Opens post / reply editor
	 * @returns {void}
	 */
	setEditorOpen() {
		this.set('isEditorOpen', true);
		Ember.run.next(this, () => {
			/*
			 iOS hack for position: fixed - now we display loading icon.
			 */
			if (/iPad|iPhone|iPod/.test(navigator.platform)) {
				Ember.$('html, body').css({
					height: '100%',
					overflow: 'hidden'
				});
			}
			Ember.$('.editor-textarea').focus();
		});
	},

	/**
	 * Closes post / reply editor
	 * @returns {void}
	 */
	setEditorClosed() {
		this.set('isEditorOpen', false);
		Ember.$('html, body').css({
			height: '',
			overflow: ''
		});
		Ember.$('.editor-textarea').blur();
	},

	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		let isAnon, isUserBlocked;

		if (this.get('isEditorOpen') === true) {
			return;
		}

		isAnon = !this.get('currentUser.isAuthenticated');
		isUserBlocked = this.get('model.isRequesterBlocked');

		if (isAnon) {
			this.rejectAnon();
		} else if (isUserBlocked) {
			this.rejectBlockedUser();
		} else {
			this.setEditorOpen();
		}
	},

	actions: {
		/**
		 * @param {boolean} active
		 * @returns {void}
		 */
		toggleEditor(active) {
			if (active === true) {
				this.activateEditor();
			} else {
				this.setEditorClosed();
			}
		}
	}
});
