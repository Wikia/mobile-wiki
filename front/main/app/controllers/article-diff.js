import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from 'common/utils/track';

const trackCategory = 'recent-wiki-activity';

export default Ember.Controller.extend(
	TrackClickMixin,
	{
		application: Ember.inject.controller(),
		shouldShowUndoConfirmation: false,
		currRecentChangeId: null,

		/**
		 * Redirects back to Recent Wiki Activity list and adds success message
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @param {string} label
		 * @returns {void}
		 */
		handleSuccess(messageKey, label) {
			this.transitionToRoute('recent-wiki-activity', {queryParams: {rc: this.get('currRecentChangeId')}})
				.then(() => {
					this.get('application').addAlert({
						message: i18n.t(messageKey, {
							pageTitle: this.get('model.title'),
							ns: 'recent-wiki-activity'
						}),
						type: 'success'
					});
				});

			this.trackImpression(label);
		},

		handleUndoSuccess() {
			this.handleSuccess('main.undo-success', 'undo-success');
		},

		handleUpvoteSuccess() {
			this.handleSuccess('main.upvote-success', 'upvote-success');
		},

		handleError(messageKey, label) {
			const application = this.get('application');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});

			application.set('isLoading', false);

			this.trackImpression(label);
		},

		/**
		 * @param {*} error
		 * @returns {void}
		 */
		handleUndoError(error) {
			const errorMsg = error === 'undofailure' ? 'main.undo-failure' : 'main.undo-error';

			this.handleError(errorMsg, 'undo-error');
		},

		handleUpvoteError() {
			this.handleError('main.upvote-error', 'upvote-error');
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
			 * Send info to server that user upvoted a revision
			 * @returns {void}
			 */
			upvote() {
				this.get('model').upvote().then(
					this.handleUpvoteSuccess.bind(this),
					this.handleUpvoteError.bind(this)
				);
				this.trackClick(trackCategory, 'upvote');
			}
		}
	}
);
