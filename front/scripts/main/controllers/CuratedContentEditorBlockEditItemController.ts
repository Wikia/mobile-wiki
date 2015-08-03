/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.CuratedContentEditorBlockEditItemController = Em.Controller.extend({
	originalItemLabel: null,
	originalItemTitle: null,
	block: null,
	isFeaturedItem: false,
	alreadyUsedLabels: []
});
