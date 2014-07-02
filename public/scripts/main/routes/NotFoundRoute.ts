/// <reference path="../app.ts" />

'use strict';

App.NotFoundRoute = Em.Route.extend({
	beforeModel: function (transition) {
		transition.abort();
	}
});
