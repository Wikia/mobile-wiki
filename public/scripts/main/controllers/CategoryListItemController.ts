/// <reference path="../app.ts" />
'use strict';
App.CategoryListItemController = Em.ObjectController.extend({
	cleanTitle: function () {
		return Wikia.Title.normalize(this.get('title').toString());
	}.property('title')
});
