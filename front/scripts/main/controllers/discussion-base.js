import App from '../app';

export default App.DiscussionBaseController = Ember.Controller.extend({

	isEditorOpen: false,

	rejectAnon() {
		this.openDialog('editor.post-error-anon-cant-post');
	},

	rejectBlockedUser() {
		this.openDialog('editor.post-error-not-authorized');
	},

	openDialog(message) {
		alert(i18n.t(message, {ns: 'discussion'}));
	},

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

	setEditorClosed() {
		if (this.get('isEditorOpen') === true) {
			this.set('isEditorOpen', false);
		}
	},

	actions: {
		toggleEditor(active) {
			if (active === true) {
				this.setEditorOpen();
			} else {
				this.setEditorClosed();
			}
		}
	}
});
