/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.NotFoundRoute = Em.Route.extend({
	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition: EmberStates.Transition): void {
		this.transitionTo('article', transition.params.notFound.url);
	}
});
