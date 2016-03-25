import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from 'common/utils/track';

const trackCategory = 'recent-wiki-activity';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['diff-page'],
		currentUser: Ember.inject.service(),
		currentUserUpvoteId: Ember.computed('model.upvotes.[]', 'currentUser.userId', function () {
			const upvotes = this.get('model.upvotes'),
				currentUserUpvote = upvotes ? upvotes.findBy(
					'from_user',
					this.get('currentUser.userId')
				) : null;

			return currentUserUpvote ? currentUserUpvote.id : null;
		}),
		userNotBlocked: Ember.computed.not('currentUser.isBlocked'),
		showButtons: Ember.computed.and('currentUser.isAuthenticated', 'userNotBlocked'),
		showDiffLink: false,
		upvoted: Ember.computed.bool('currentUserUpvoteId'),
		upvotesEnabled: Ember.get(Mercury, 'wiki.language.content') === 'en',
		shouldShowUndoConfirmation: false,

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

		/**
		 * Send request to server to remove previously added upvote for a revision
		 * @param {int} upvoteId ID of upvote record to remove
		 * @returns {void}
		 */
		removeUpvote(upvoteId) {
			this.get('removeUpvote')(upvoteId).then(
				this.trackSuccess.bind(this, 'remove-upvote-success'),
				this.handleError.bind(this, 'main.error', 'remove-upvote-error')
			);
			this.trackClick(trackCategory, 'remove-upvote');
		},

		/**
		 * Send info to server that user upvoted a revision
		 * @returns {void}
		 */
		upvote() {
			this.get('addUpvote')(this.get('currentUser.userId')).then(
				this.trackSuccess.bind(this, 'upvote-success'),
				this.handleError.bind(this, 'main.error', 'upvote-error')
			);
			this.trackClick(trackCategory, 'upvote');
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

		actions: {
			/**
			 * Adds or removes upvote
			 * @returns {void}
			 */
			handleVote() {
				if (this.get('upvoted')) {
					this.removeUpvote(this.get('currentUserUpvoteId'));
				} else {
					this.upvote();
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

				this.trackClick(trackCategory, 'undo');
			}
		}
	}
);
