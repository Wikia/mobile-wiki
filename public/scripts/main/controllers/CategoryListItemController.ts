/// <reference path="../app.ts" />
'use strict';
App.CategoryListItemController = Em.ObjectController.extend({
	cleanTitle: function () {
		return this.get('title').toString().replace(/_/gi, ' ');
	}.property('title')
});

