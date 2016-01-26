import Ember from 'ember';

export default Ember.Route.extend({
	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition) {
		this.transitionTo('article', transition.params.notFound.url);
	}
});
