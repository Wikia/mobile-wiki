import App from '../app';

export default App.DiscussionBaseController = Ember.Controller.extend({

	isEditorOpen: false,

	rejectAnon() {
		this.openDialog('anon');
	},

	rejectBlockedUser() {
		this.openDialog('blocked');
	},

	openDialog(message) {
		window.alert(message);
	},

	setEditorOpen() {
		const isAnon = this.get('currentUser.isAuthenticated') === null,
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
