import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import DiscussionEditEditorMixin from '../../mixins/discussion-edit-editor';
import DiscussionBaseController from './base';


export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	DiscussionEditEditorMixin,
	{
		isLoading: false,
		isAnon: Ember.computed.not('currentUser.isAuthenticated'),
		isEditorOpen: false,
		isUserBlocked: false,
		errorMessage: null,

		currentUser: Ember.inject.service(),
		modalDialog: Ember.inject.service(),

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

		actions: {
			setEditorActive(active) {
				if (active === true) {
					this.activateEditor();
				} else {
					this.setProperties({
						errorMessage: null,
						isEditorOpen: false
					});
				}
			}
		}
	}
);
