/// <reference path="../app.ts" />
'use strict';

App.ArticleCommentComponent = Em.Component.extend({
	tagName: 'li',
	classNames: ['article-comment'],

	expanded: false,

	users: null,
	comment: null,

	avatarUrl: function () {
		var users = this.get('users');

		return users[this.get('comment.userName')].avatar;
	}.property('comment.userName'),

	url: function () {
		var users = this.get('users');

		return users[this.get('comment.userName')].url;
	}.property('comment.userName'),

	actions: {
		toggleExpand: function () {
			this.toggleProperty('expanded');
		}
	}
});
