/// <reference path="../app.ts" />

'use strict';
Wikia.WikiRoute = Em.Route.extend({
	model: function (params) {
		console.log(params);
		return Em.Object.create(params);
	}
});

