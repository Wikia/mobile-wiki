/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend({
	beforeModel: function (transition: EmberStates.Transition) {
		this.transitionTo('article', Mercury.wiki.mainPageTitle);
	}
});
