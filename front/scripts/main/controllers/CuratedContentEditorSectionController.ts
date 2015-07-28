/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.CuratedContentEditorSectionController = Em.Controller.extend({
	isNewSection: false,
	originalSectionLabel: null,
	queryParams: ['isNewSection']
});
