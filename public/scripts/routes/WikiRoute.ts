/// <reference path="../app.ts" />
'use strict';

Wikia.WikiRoute = Em.Route.extend({
	model: function (params): Em.Object {
		console.log(params);
		return Em.Object.create(params);
	}
});

