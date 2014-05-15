/// <reference path="../app.ts" />
'use strict';

Wikia.WikiIndexRoute = Em.Route.extend({
	model: function <T> (params: T): T {
		return params;
	}
});
