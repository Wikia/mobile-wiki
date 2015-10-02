/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.SearchResultsController = Em.Controller.extend({
	queryParams: ['q'],
	q: null,
});
