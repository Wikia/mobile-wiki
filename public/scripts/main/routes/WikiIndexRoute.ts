/// <reference path="../app.ts" />
'use strict';

App.WikiIndexRoute = Em.Route.extend({
	model: function <T>(params: T): T {
		return params;
	}
});
