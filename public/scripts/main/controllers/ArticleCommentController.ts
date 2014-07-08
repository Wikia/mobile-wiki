/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentController = Ember.ObjectController.extend({
	needs: ['articleUsers'],
	avatarUrl: Ember.computed('content.userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].avatar;
	}),
	url: Ember.computed('content.userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].url;
	}),
});
