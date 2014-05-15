/// <reference path="../app.ts" />
'use strict';

Wikia.WikiRoute = Em.Route.extend({
	model: function (params: any): {} {
		console.log(params);
		return Em.Object.create(params);
	}
});
