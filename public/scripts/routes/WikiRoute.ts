/// <reference path="../app.ts" />
'use strict';

App.WikiRoute = Em.Route.extend({
	model: function (params: any): {} {
		console.log(params);
		return Em.Object.create(params);
	}
});
