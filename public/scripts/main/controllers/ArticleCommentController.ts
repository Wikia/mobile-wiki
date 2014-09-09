/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentController = Em.ObjectController.extend({
	needs: ['articleUsers'],
	expanded: false,
	avatarUrl: function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].avatar;
	}.property('content.userName'),

	url: function () {
		var users = this.parentController.get('controllers.articleUsers').get('content');
		return users[this.get('content.userName')].url;
	}.property('content.userName'),

	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
