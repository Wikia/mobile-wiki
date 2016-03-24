import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from 'common/utils/track';

const trackCategory = 'recent-wiki-activity';

export default Ember.Controller.extend(
	TrackClickMixin,
	{
		application: Ember.inject.controller(),
		currentUser: Ember.inject.service(),
		shouldShowUndoConfirmation: false,
		currRecentChangeId: null,

		/**
		 * Adds success banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		showSuccess(messageKey) {
			this.get('application').addAlert({
				message: i18n.t(messageKey, {
					pageTitle: this.get('model.title'),
					ns: 'recent-wiki-activity'
				}),
				type: 'success'
			});
		},

		handleRemoveUpvoteSuccess() {
			this.trackImpression('remove-upvote-success');
		},

		/**
		 * Redirects back to Recent Wiki Activity list and adds success banner
		 * @returns {void}
		 */
		handleUndoSuccess() {
			this.transitionToRoute('recent-wiki-activity', {queryParams: {rc: this.get('currRecentChangeId')}})
				.then(() => this.showSuccess('main.undo-success'));

			this.trackImpression('undo-success');
		},

		handleUpvoteSuccess() {
			this.trackImpression('upvote-success');
		},

		/**
		 * Adds error banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @param {string} label Label for tracking
		 * @returns {void}
		 */
		handleError(messageKey, label) {
			const application = this.get('application');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});

			application.set('isLoading', false);

			this.trackImpression(label);
		},

		handleRemoveUpvoteError() {
			this.handleError('main.error', 'remove-upvote-error');
		},

		/**
		 * @param {*} error
		 * @returns {void}
		 */
		handleUndoError(error) {
			const errorMsg = error === 'undofailure' ? 'main.undo-failure' : 'main.error';

			this.handleError(errorMsg, 'undo-error');
		},

		handleUpvoteError() {
			this.handleError('main.error', 'upvote-error');
		},

		/**
		 * Sends impression tracking for recent-wiki-activity category
		 * @param {string} label
		 * @returns {void}
		 */
		trackImpression(label) {
			track({
				action: trackActions.open,
				category: trackCategory,
				label
			});
		},

		actions: {
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
			 * Send request to server to remove previously added upvote for a revision
			 * @param {int} upvoteId ID of upvote record to remove
			 * @returns {void}
			 */
			removeUpvote(upvoteId) {
				this.get('model').removeUpvote(upvoteId).then(
					this.handleRemoveUpvoteSuccess.bind(this),
					this.handleRemoveUpvoteError.bind(this)
				);
				this.trackClick(trackCategory, 'remove-upvote');
			},

			/**
			 * @param {string} summary Description of reason for undo to be stored as edit summary
			 * @returns {void}
			 */
			undo(summary) {
				this.get('application').set('isLoading', true);

				this.get('model').undo(summary).then(
					this.handleUndoSuccess.bind(this),
					this.handleUndoError.bind(this)
				);

				this.trackClick(trackCategory, 'undo');
			},

			/**
			 * Send info to server that user upvoted a revision
			 * @returns {void}
			 */
			upvote() {
				this.get('model').upvote(this.get('currentUser.userId')).then(
					this.handleUpvoteSuccess.bind(this),
					this.handleUpvoteError.bind(this)
				);
				this.trackClick(trackCategory, 'upvote');
			}
		}
	}
);
