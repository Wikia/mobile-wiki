import Ember from 'ember';
import ArticleDiffModel from '../models/article-diff';
import {track, trackActions} from 'common/utils/track';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),

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
		 * @returns {void}
		 */
		undo() {
			this.get('application').set('isLoading', true);

			this.get('model').undo().then(
				this.handleUndoSuccess.bind(this),
				this.handleUndoError.bind(this)
			);

			track({
				action: trackActions.click,
				category: 'recent-wiki-activity',
				label: 'undo'
			});
		}
	}
});
