/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.CuratedContentEditorSectionController = Em.Controller.extend({
	queryParams: {
		isNewSection: 'new'
	},
	isNewSection: false,
	originalSectionLabel: null
});
