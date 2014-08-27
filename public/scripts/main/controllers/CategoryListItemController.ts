/// <reference path="../app.ts" />
'use strict';
App.CategoryListItemController = Ember.ObjectController.extend({
	cleanTitle: function () {
		return this.get('title').toString().replace(/_/gi, ' ');
	}.property('title')
});

