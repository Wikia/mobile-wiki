/// <reference path="../app.ts" />
'use strict';

App.UserController = Ember.ObjectController.extend({
	avatarUrl: Ember.computed('userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('userName')].avatar;
	}),
	url: Ember.computed('userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('userName')].url;
	}),
});
