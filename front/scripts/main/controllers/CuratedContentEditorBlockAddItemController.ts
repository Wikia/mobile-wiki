/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.CuratedContentEditorBlockAddItemController = Em.Controller.extend({
	originalItemLabel: null,
	originalItemTitle: null,
	isFeaturedItem: false,
	alreadyUsedLabels: []
});
