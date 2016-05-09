import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	queryParams: ['rc'],
	rc: null,

	actions: {
		/**
		 * Adds error banner
		 * @param {string} messageKey message key with prefix (taken from recent-wiki-activity namespace)
		 * @returns {void}
		 */
		showError(messageKey) {
			const application = this.get('application');

			application.addAlert({
				message: i18n.t(messageKey, {ns: 'recent-wiki-activity'}),
				type: 'alert'
			});
		}
	}
});
