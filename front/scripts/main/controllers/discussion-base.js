import App from '../app';
import DiscussionDeleteControllerMixin from '../mixins/discussion-delete-controller';

export default App.DiscussionBaseController = Ember.Controller.extend(DiscussionDeleteControllerMixin, {
	/**
	 * Checks if it is possible (if it is allowed for the user) and opens post/reply editor
	 * or displays message with deny message
	 * @returns {void}
	 */
	activateEditor() {
		let isAnon, isUserBlocked;

		if (this.discussionEditor.get('isEditorOpen') === true) {
			return;
		}

		isAnon = !this.get('currentUser.isAuthenticated');
		isUserBlocked = this.get('model.isRequesterBlocked');

		if (isAnon) {
			this.discussionEditor.rejectAnon();
		} else if (isUserBlocked) {
			this.discussionEditor.rejectBlockedUser();
		} else {
			this.discussionEditor.setEditorOpen();
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
				this.discussionEditor.setEditorClosed();
			}
		}
	}
});
