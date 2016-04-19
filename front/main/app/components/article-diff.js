import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

const trackCategory = 'recent-wiki-activity';

export default Ember.Component.extend(
	{
		classNames: ['diff-page'],
		currentUser: Ember.inject.service(),
		revisionUpvotes: Ember.inject.service(),
		currentUserUpvoteId: Ember.computed('revisionUpvotes.upvotes.@each.count', function () {
			const upvotes = this.get('revisionUpvotes.upvotes').findBy('revisionId', this.get('model.newId'));

			return upvotes.userUpvoteId || 0;
		}),
		userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
		showButtons: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
		showDiffLink: false,
		upvoted: Ember.computed.bool('currentUserUpvoteId'),
		shouldShowUndoConfirmation: false,

		addUpvote() {
			this.get('revisionUpvotes').upvote(
				this.get('model.newId'),
				this.get('model.title')
			).then(
				() => this.trackSuccess('upvote-success'),
				() => this.handleError('main.error', 'upvote-error')
			);

			track({
				action: trackActions.click,
				category: trackCategory,
				label: 'upvote'
			});
		},

		/**
		 * Send request to server to remove previously added upvote for a revision
		 * @param {number} upvoteId ID of upvote record to remove
		 * @returns {void}
		 */
		removeUpvote(upvoteId) {
			this.get('revisionUpvotes').removeUpvote(
				this.get('model.newId'),
				upvoteId,
				this.get('model.title'),
				this.get('model.userId')
			).then(
				() => this.trackSuccess('remove-upvote-success'),
				() => this.handleError('main.error', 'remove-upvote-error')
			);

			track({
				action: trackActions.click,
				category: trackCategory,
				label: 'remove-upvote'
			});
		},

		/**
		 * Sends impression success tracking for recent-wiki-activity category
		 * @param {string} label
		 * @returns {void}
		 */
		trackSuccess(label) {
			track({
				action: trackActions.success,
				category: trackCategory,
				label
			});
		},

		/**
		 * Sends impression error tracking for recent-wiki-activity category
		 * @param {string} label
		 * @returns {void}
		 */
		trackError(label) {
			track({
				action: trackActions.error,
				category: trackCategory,
				label
			});
		},

		/**
		 * Displays error message
		 *
		 * @param {string} messageKey
		 * @param {string} label
		 * @returns {void}
		 */
		handleError(messageKey, label) {
			this.trackError(label);
			this.get('showError')(messageKey);
		},

		actions: {
			/**
			 * Adds or removes upvote
			 * @returns {void}
			 */
			handleVote() {
				if (this.get('currentUser.isAuthenticated')) {
					if (this.get('upvoted')) {
						this.removeUpvote(this.get('currentUserUpvoteId'));
					} else {
						this.addUpvote();
					}
				}
			},

			/**
			 * Shows confirmation modal
			 * @returns {void}
			 */
			showConfirmation() {
				this.set('shouldShowUndoConfirmation', true);

				track({
					action: trackActions.open,
					category: trackCategory,
					label: 'undo-confirmation-open'
				});
			},

			/**
			 * Closes confirmation modal
			 * @returns {void}
			 */
			closeConfirmation() {
				this.set('shouldShowUndoConfirmation', false);

				track({
					action: trackActions.close,
					category: trackCategory,
					label: 'undo-confirmation-close'
				});
			},

			/**
			 * @param {string} summary Description of reason for undo to be stored as edit summary
			 * @returns {void}
			 */
			undo(summary) {
				this.get('undo')(summary).then(
					() => {
						this.trackSuccess('undo-success');
						this.get('redirectToRWA')().then(() => this.get('showSuccess')('main.undo-success'));
					},
					(errorMsg) => {
						this.handleError(errorMsg, 'undo-error');
					}
				);

				track({
					action: trackActions.click,
					category: trackCategory,
					label: 'undo'
				});
			}
		}
	}
);
