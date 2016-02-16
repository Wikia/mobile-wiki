import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition) {
		const title = transition.params.page.pageTitle.replace('wiki/', ''),
			ns = parseInt(M.prop('mediaWikiNamespace'), 10);

		switch (ns) {
		case 0:
			this.transitionTo('article', title);
			break;

		case 14:
			this.transitionTo('category', title);
			break;

		default:
			// @todo add not-supported-page here
		}
	}
});
