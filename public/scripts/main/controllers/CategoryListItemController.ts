/// <reference path="../app.ts" />
'use strict';
App.CategoryListItemController = Ember.ObjectController.extend({
	cleanTitle: Ember.computed('title', function () {
		return this.get('title').toString().replace(/_/gi, ' ');
	})
});

