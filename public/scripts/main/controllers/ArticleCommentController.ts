/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentController = Em.ObjectController.extend({
	needs: ['articleComments'],

	expanded: false,

	users: Em.computed.alias(
		'controllers.articleComments.model.users'
	),

	avatarUrl: function () {
		var users = this.get('users');

		return users[this.get('content.userName')].avatar;
	}.property('content.userName'),

	url: function () {
		var users = this.get('users');

		return users[this.get('content.userName')].url;
	}.property('content.userName'),

	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
