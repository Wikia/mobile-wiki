/// <reference path="../app.ts" />

'use strict';

App.NotFoundRoute = Em.Route.extend({
	beforeModel: function (transition) {
		// debugger;
		transition.abort();
	},
	model: function (params) {
		return params;
	}
});
