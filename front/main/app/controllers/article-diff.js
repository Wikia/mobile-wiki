import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
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

	actions: {
		/**
		 * Adds error banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		showError(messageKey) {
			const application = this.get('application');

			console.log('help');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});

			application.set('isLoading', false);
		},

		/**
		 * Redirects back to Recent Wiki Activity list and adds success banner
		 * @returns {void}
		 */
		redirectToRWA() {
			this.transitionToRoute('recent-wiki-activity', {queryParams: {rc: this.get('currRecentChangeId')}})
				.then(() => this.showSuccess('main.undo-success'));
		},

		setLoading() {
			this.get('application').set('isLoading', true);
		}
	}
});
