/// <reference path="../app.ts" />
'use strict';

Wikia.ApplicationRoute = Em.Route.extend({
	model: function<T>(params: T): T {
		return params;
	}
});
