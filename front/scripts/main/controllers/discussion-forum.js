import App from '../app';
import DiscussionDeleteControllerMixin from '../mixins/discussion-delete-controller';

export default App.DiscussionForumController = Ember.Controller.extend(DiscussionDeleteControllerMixin, {
	application: Ember.inject.controller(),
	sortBy: null,

	smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),

	// Whether the sort component is currently visible
	sortVisible: false,

	editorActive: false,

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
			this.set('isEditorOpen', true);
		}
	},

	sortTypes: [
		{
			name: 'latest',
			messageKey: 'main.sort-by-latest'
		},
		{
			name: 'trending',
			messageKey: 'main.sort-by-trending'
		}
	],

	sortMessageKey: Ember.computed('sortBy', function () {
		const sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj) => {
				return obj.name === this.get('sortBy');
			});

		return filtered.length ? filtered[0].messageKey : sortTypes[0].messageKey;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		showSortComponent() {
			this.set('sortVisible', true);
		},

		/**
		 * @returns {void}
		 */
		hideSortComponent() {
			this.set('sortVisible', false);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},

		openEditor() {
			this.setEditorOpen();
		},

		closeEditor() {
			this.setEditorClosed();
		},

		toggleEditor(active) {
			if (this.get('isEditorOpen') !== active) {
				this.set('isEditorOpen', active);
			}
		}
	}
});
