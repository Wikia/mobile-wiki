/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentController = Ember.ObjectController.extend({
	needs: ['articleUsers'],
	expanded: false,
	avatarUrl: Ember.computed('content.userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].avatar;
	}),
	url: Ember.computed('content.userName', function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].url;
	}),
	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
