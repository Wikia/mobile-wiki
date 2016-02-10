import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	shouldShowUndoConfirmation: false,

	/**
	 * @returns {void}
	 */
	handleUndoSuccess() {
		this.transitionToRoute('recent-wiki-activity').then(() => {
			this.get('application').addAlert({
				message: i18n.t('main.undo-success', {
					pageTitle: this.get('model.title'),
					ns: 'recent-wiki-activity'
				}),
				type: 'success'
			});
		});

		track({
			action: trackActions.impression,
			category: 'recent-wiki-activity',
			label: 'undo-success'
		});
	},

	/**
	 * @param {*} error
	 * @returns {void}
	 */
	handleUndoError(error) {
		const application = this.get('application'),
			errorMsg = error === 'undofailure' ? 'main.undo-failure' : 'main.undo-error';

		application.addAlert({
			message: i18n.t(errorMsg, {ns: 'recent-wiki-activity'}),
			type: 'alert'
		});

		application.set('isLoading', false);

		track({
			action: trackActions.impression,
			category: 'recent-wiki-activity',
			label: 'undo-error'
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

			track({
				action: trackActions.click,
				category: 'recent-wiki-activity',
				label: 'undo'
			});
		},

		/**
		 * Shows confirmation modal
		 * @returns {void}
		 */
		showConfirmation() {
			this.set('shouldShowUndoConfirmation', true);

			track({
				action: trackActions.open,
				category: 'recent-wiki-activity',
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
				category: 'recent-wiki-activity',
				label: 'undo-confirmation-close'
			});
		},
	}
});
